import { IAssetManager, IAvatarAssetDownloadLibrary } from '../../api';
import { EventDispatcher } from '../../core';
import { AvatarRenderLibraryEvent } from '../../events';

export class AvatarAssetDownloadLibrary extends EventDispatcher implements IAvatarAssetDownloadLibrary
{
    public static DOWNLOAD_COMPLETE: string = 'AADL_DOWNLOAD_COMPLETE';

    private static NOT_LOADED: number = 0;
    private static LOADING: number = 1;
    private static LOADED: number = 2;

    private _state: number;
    private _libraryName: string;
    private _revision: string;
    private _downloadUrls: string[];
    private _assets: IAssetManager;

    constructor(id: string, revision: string, assets: IAssetManager, assetUrls: string[])
    {
        super();

        this._state = AvatarAssetDownloadLibrary.NOT_LOADED;
        this._libraryName = id;
        this._revision = revision;
        this._assets = assets;
        this._downloadUrls = [];

        const urls = (assetUrls && assetUrls.length ? assetUrls : []).filter((url): url is string => !!url);

        for(const url of urls)
        {
            this._downloadUrls.push(
                url
                    .replace(/%libname%/gi, this._libraryName)
                    .replace(/%revision%/gi, this._revision)
            );
        }

        if(!this._downloadUrls.length)
        {
            this._downloadUrls.push('');
        }

        const asset = this._assets.getCollection(this._libraryName);

        if(asset) this._state = AvatarAssetDownloadLibrary.LOADED;
    }

    public async downloadAsset(): Promise<void>
    {
        if(!this._assets || (this._state === AvatarAssetDownloadLibrary.LOADING) || (this._state === AvatarAssetDownloadLibrary.LOADED)) return;

        const asset = this._assets.getCollection(this._libraryName);

        if(asset)
        {
            this._state = AvatarAssetDownloadLibrary.LOADED;

            this.dispatchEvent(new AvatarRenderLibraryEvent(AvatarRenderLibraryEvent.DOWNLOAD_COMPLETE, this));

            return;
        }

        this._state = AvatarAssetDownloadLibrary.LOADING;

        let didLoad = false;

        for(const url of this._downloadUrls)
        {
            if(!url) continue;

            const status = await this._assets.downloadAsset(url);

            if(!status) continue;

            if(this._assets.getCollection(this._libraryName))
            {
                didLoad = true;
                break;
            }
        }

        if(!didLoad)
        {
            this._state = AvatarAssetDownloadLibrary.NOT_LOADED;

            return;
        }

        this._state = AvatarAssetDownloadLibrary.LOADED;

        this.dispatchEvent(new AvatarRenderLibraryEvent(AvatarRenderLibraryEvent.DOWNLOAD_COMPLETE, this));
    }

    public get libraryName(): string
    {
        return this._libraryName;
    }

    public get isLoaded(): boolean
    {
        return (this._state === AvatarAssetDownloadLibrary.LOADED);
    }
}
