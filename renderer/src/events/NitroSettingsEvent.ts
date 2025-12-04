import { NitroEvent } from './core';

export class NitroSettingsEvent extends NitroEvent
{
    public static SETTINGS_UPDATED: string = 'NSE_SETTINGS_UPDATED';

    private _volumeSystem: number;
    private _volumeFurni: number;
    private _volumeTrax: number;
    private _oldChat: boolean;
    private _oldRotations: boolean;
    private _roomInvites: boolean;
    private _cameraFollow: boolean;
    private _wiredAnimations: boolean;
    private _mouseWheelZoom: boolean;
    private _flags: number;
    private _chatType: number;

    constructor()
    {
        super(NitroSettingsEvent.SETTINGS_UPDATED);
    }

    public clone(): NitroSettingsEvent
    {
        const clone = new NitroSettingsEvent();

        clone._volumeSystem = this._volumeSystem;
        clone._volumeFurni = this._volumeFurni;
        clone._volumeTrax = this._volumeTrax;
        clone._oldChat = this._oldChat;
        clone._oldRotations = this._oldRotations;
        clone._roomInvites = this._roomInvites;
        clone._cameraFollow = this._cameraFollow;
        clone._wiredAnimations = this._wiredAnimations;
        clone._mouseWheelZoom = this._mouseWheelZoom;
        clone._flags = this._flags;
        clone._chatType = this._chatType;

        return clone;
    }

    public get volumeSystem(): number
    {
        return this._volumeSystem;
    }

    public set volumeSystem(volume: number)
    {
        this._volumeSystem = volume;
    }

    public get volumeFurni(): number
    {
        return this._volumeFurni;
    }

    public set volumeFurni(volume: number)
    {
        this._volumeFurni = volume;
    }

    public get volumeTrax(): number
    {
        return this._volumeTrax;
    }

    public set volumeTrax(volume: number)
    {
        this._volumeTrax = volume;
    }

    public get oldChat(): boolean
    {
        return this._oldChat;
    }

    public set oldChat(value: boolean)
    {
        this._oldChat = value;
    }

    public get oldRotations(): boolean
    {
        return this._oldRotations;
    }

    public set oldRotations(value: boolean)
    {
        this._oldRotations = value;
    }

    public get roomInvites(): boolean
    {
        return this._roomInvites;
    }

    public set roomInvites(value: boolean)
    {
        this._roomInvites = value;
    }

    public get cameraFollow(): boolean
    {
        return this._cameraFollow;
    }

    public set cameraFollow(value: boolean)
    {
        this._cameraFollow = value;
    }

    public get wiredAnimations(): boolean
    {
        return this._wiredAnimations;
    }

    public set wiredAnimations(value: boolean)
    {
        this._wiredAnimations = value;
    }

    public get mouseWheelZoom(): boolean
    {
        return this._mouseWheelZoom;
    }

    public set mouseWheelZoom(value: boolean)
    {
        this._mouseWheelZoom = value;
    }

    public get flags(): number
    {
        return this._flags;
    }

    public set flags(flags: number)
    {
        this._flags = flags;
    }

    public get chatType(): number
    {
        return this._chatType;
    }

    public set chatType(type: number)
    {
        this._chatType = type;
    }
}
