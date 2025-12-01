import { BaseTexture } from '@pixi/core';
import { Data, inflate } from 'pako';
import { sha256 } from 'js-sha256';
import nacl from 'tweetnacl';
import { NitroConfiguration } from '../configuration';
import { NitroLogger } from '../common';
import { ArrayBufferToBase64 } from './ArrayBufferToBase64';
import { BinaryReader } from './BinaryReader';

interface NitroBundleProtectionPayload
{
    version: number;
    issuer: string;
    bundleId: string;
    assetType?: string;
    allowedHosts?: string[];
    issuedAt: number;
    nonce: string;
    hash: string;
    algorithm: string;
}

interface NitroBundleProtectionBlock extends NitroBundleProtectionPayload
{
    signature: string;
}

export class NitroBundle
{
    private static TEXT_DECODER: TextDecoder = new TextDecoder('utf-8');
    private static TEXT_ENCODER: TextEncoder = new TextEncoder();
    private static readonly PROTECTION_MAGIC = 'NTRP';
    private static readonly PROTECTION_HEADER_LENGTH = 9;
    private static readonly GUARD_MAGIC = 'NENC';
    private static readonly GUARD_HEADER_LENGTH = 9;

    private _jsonFile: Object = null;
    private _image: string = null;
    private _imageData: Uint8Array = null;
    private _baseTexture: BaseTexture = null;
    private _protectionBlock: NitroBundleProtectionBlock = null;
    private _payloadBytes: Uint8Array = null;

    constructor(arrayBuffer: ArrayBuffer)
    {
        const normalizedBuffer = this.stripGuardHeader(arrayBuffer);

        this._payloadBytes = new Uint8Array(normalizedBuffer);
        this.parse(normalizedBuffer);
        this.enforceProtection();
    }

    public parse(arrayBuffer: ArrayBuffer): void
    {
        const binaryReader = new BinaryReader(arrayBuffer);

        let fileCount = binaryReader.readShort();

        while(fileCount > 0)
        {
            const fileNameLength = binaryReader.readShort();
            const fileName = binaryReader.readBytes(fileNameLength).toString();
            const fileLength = binaryReader.readInt();
            const buffer = binaryReader.readBytes(fileLength);

            if(fileName.endsWith('.json'))
            {
                const decompressed = inflate((buffer.toArrayBuffer() as Data));

                this._jsonFile = JSON.parse(NitroBundle.TEXT_DECODER.decode(decompressed));
            }
            else
            {
                const decompressed = inflate((buffer.toArrayBuffer() as Data));
                const base64 = ArrayBufferToBase64(decompressed);

                this._baseTexture = new BaseTexture('data:image/png;base64,' + base64);
            }

            fileCount--;
        }

        this.tryParseProtection(binaryReader, arrayBuffer);
    }

    get jsonFile(): Object
    {
        return this._jsonFile;
    }

    public get baseTexture(): BaseTexture
    {
        return this._baseTexture;
    }

    public get protectionBlock(): NitroBundleProtectionBlock
    {
        return this._protectionBlock;
    }

    private tryParseProtection(binaryReader: BinaryReader, source: ArrayBuffer): void
    {
        if(!binaryReader || (binaryReader.remaining() < NitroBundle.PROTECTION_HEADER_LENGTH)) return;

        const magic = binaryReader.readBytes(4).toString();

        if(magic !== NitroBundle.PROTECTION_MAGIC) return;

        const version = binaryReader.readByte();
        const metadataLength = binaryReader.readInt();

        if(metadataLength <= 0 || (metadataLength > binaryReader.remaining())) return;

        const metadataReader = binaryReader.readBytes(metadataLength);

        try
        {
            const block = JSON.parse(metadataReader.toString()) as NitroBundleProtectionBlock;

            block.version = version;

            this._protectionBlock = block;

            const footerLength = NitroBundle.PROTECTION_HEADER_LENGTH + metadataLength;
            const payloadLength = (source.byteLength - footerLength);

            if(payloadLength > 0)
            {
                this._payloadBytes = new Uint8Array(source, 0, payloadLength);
            }
        }

        catch (error)
        {
            NitroLogger.warn(`Failed to parse Nitro protection metadata: ${ (error as Error)?.message ?? error }`);
        }
    }

    private enforceProtection(): void
    {
        if(!NitroConfiguration.getValue<boolean>('nitro.bundle.protection.enabled', false)) return;

        if(!this._protectionBlock) throw new Error('Protected Nitro asset is missing metadata.');

        this.ensureIssuer();
        this.ensureHostAllowance();
        this.ensureHashIntegrity();
        this.ensureSignature();
    }

    private ensureIssuer(): void
    {
        const requiredIssuer = NitroConfiguration.getValue<string>('nitro.bundle.protection.issuer', null);

        if(requiredIssuer && (this._protectionBlock.issuer !== requiredIssuer))
        {
            throw new Error('Nitro bundle issuer mismatch.');
        }
    }

    private ensureHostAllowance(): void
    {
        const currentHost = this.getCurrentHost();
        const configuredHosts = NitroConfiguration.getValue<string[]>('nitro.bundle.protection.allowedHosts', []) || [];

        if(currentHost && configuredHosts.length && !NitroBundle.isHostAllowed(currentHost, configuredHosts))
        {
            throw new Error('Current host blocked by client configuration.');
        }

        if(currentHost && this._protectionBlock.allowedHosts && this._protectionBlock.allowedHosts.length)
        {
            if(!NitroBundle.isHostAllowed(currentHost, this._protectionBlock.allowedHosts))
            {
                throw new Error('Current host not authorized by bundle metadata.');
            }
        }
    }

    private ensureHashIntegrity(): void
    {
        if(!this._payloadBytes || !this._payloadBytes.length) throw new Error('Unable to validate Nitro bundle payload.');

        const payloadHash = NitroBundle.computePayloadHash(this._payloadBytes);

        if(payloadHash !== this._protectionBlock.hash)
        {
            throw new Error('Nitro bundle payload hash mismatch.');
        }
    }

    private ensureSignature(): void
    {
        const publicKeyBase64 = NitroConfiguration.getValue<string>('nitro.bundle.protection.publicKey', '');

        if(!publicKeyBase64 || !publicKeyBase64.length)
        {
            throw new Error('Nitro bundle protection public key missing.');
        }

        if(!this._protectionBlock.signature || !this._protectionBlock.signature.length)
        {
            throw new Error('Nitro bundle signature missing.');
        }

        const publicKey = NitroBundle.base64ToUint8Array(publicKeyBase64);
        const signature = NitroBundle.base64ToUint8Array(this._protectionBlock.signature);
        const payload = NitroBundle.buildSignaturePayload(this._protectionBlock);

        const isValid = nacl.sign.detached.verify(payload, signature, publicKey);

        if(!isValid)
        {
            throw new Error('Nitro bundle signature validation failed.');
        }
    }

    private getCurrentHost(): string
    {
        if(typeof window === 'undefined') return '';

        return (window.location?.hostname || '').toLowerCase();
    }

    private static isHostAllowed(host: string, whitelist: string[]): boolean
    {
        if(!whitelist || !whitelist.length) return true;

        const normalizedHost = host.toLowerCase();

        return whitelist.some(entry =>
        {
            const normalizedEntry = entry.toLowerCase();

            if(normalizedEntry === '*') return true;

            if(normalizedEntry.startsWith('*.'))
            {
                const suffix = normalizedEntry.substring(1);

                return normalizedHost.endsWith(suffix);
            }

            return normalizedHost === normalizedEntry;
        });
    }

    private static computePayloadHash(payload: Uint8Array): string
    {
        const hashBuffer = sha256.arrayBuffer(payload) as ArrayBuffer;

        return NitroBundle.uint8ArrayToBase64(new Uint8Array(hashBuffer));
    }

    private static buildSignaturePayload(block: NitroBundleProtectionBlock): Uint8Array
    {
        const payload: NitroBundleProtectionPayload = {
            version: block.version,
            issuer: block.issuer,
            bundleId: block.bundleId,
            assetType: block.assetType,
            allowedHosts: block.allowedHosts,
            issuedAt: block.issuedAt,
            nonce: block.nonce,
            hash: block.hash,
            algorithm: block.algorithm
        };

        return NitroBundle.TEXT_ENCODER.encode(JSON.stringify(payload));
    }

    private static base64ToUint8Array(value: string): Uint8Array
    {
        if(!value) return new Uint8Array(0);

        const normalized = value.replace(/\s+/g, '');
        const binary = atob(normalized);
        const bytes = new Uint8Array(binary.length);

        for(let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

        return bytes;
    }

    private static uint8ArrayToBase64(value: Uint8Array): string
    {
        if(!value || !value.length) return '';

        let binary = '';

        for(let i = 0; i < value.length; i++) binary += String.fromCharCode(value[i]);

        return btoa(binary);
    }

    private stripGuardHeader(arrayBuffer: ArrayBuffer): ArrayBuffer
    {
        if(!arrayBuffer || (arrayBuffer.byteLength <= NitroBundle.GUARD_HEADER_LENGTH)) return arrayBuffer;

        const magic = NitroBundle.TEXT_DECODER.decode(new Uint8Array(arrayBuffer, 0, 4));

        if(magic !== NitroBundle.GUARD_MAGIC) return arrayBuffer;

        const view = new DataView(arrayBuffer);
        const version = view.getUint8(4);
        const payloadLength = view.getUint32(5);

        const minExpectedLength = (NitroBundle.GUARD_HEADER_LENGTH + payloadLength);

        if(minExpectedLength > arrayBuffer.byteLength)
        {
            throw new Error('Invalid Nitro guard header payload length.');
        }

        NitroLogger.log(`Encountered guarded Nitro bundle (version ${ version }).`);

        return arrayBuffer.slice(NitroBundle.GUARD_HEADER_LENGTH);
    }
}
