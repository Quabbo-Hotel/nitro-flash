import { IMessageDataWrapper, IMessageParser } from '../../../../../../api';

export class RoomSpotlightOverlayParser implements IMessageParser
{
    private _enabled: boolean;
    private _radiusPercent: number;
    private _featherPercent: number;
    private _opacityPercent: number;

    public flush(): boolean
    {
        this._enabled = false;
        this._radiusPercent = 0;
        this._featherPercent = 0;
        this._opacityPercent = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._enabled = wrapper.readBoolean();
        this._radiusPercent = wrapper.readInt();
        this._featherPercent = wrapper.readInt();
        this._opacityPercent = wrapper.readInt();

        return true;
    }

    public get enabled(): boolean
    {
        return this._enabled;
    }

    public get radiusPercent(): number
    {
        return this._radiusPercent;
    }

    public get featherPercent(): number
    {
        return this._featherPercent;
    }

    public get opacityPercent(): number
    {
        return this._opacityPercent;
    }
}
