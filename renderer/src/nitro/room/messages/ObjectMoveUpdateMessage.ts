import { IVector3D } from '../../../api';
import { RoomObjectUpdateMessage } from '../../../room';

export class ObjectMoveUpdateMessage extends RoomObjectUpdateMessage
{
    private _targetLocation: IVector3D;
    private _isSlide: boolean;
    private _updateInterval: number;

    constructor(location: IVector3D, targetLocation: IVector3D, direction: IVector3D, isSlide: boolean = false)
    {
        super(location, direction);

        this._targetLocation = targetLocation;
        this._isSlide = isSlide;
        this._updateInterval = undefined;
    }

    public get targetLocation(): IVector3D
    {
        if(!this._targetLocation) return this.location;

        return this._targetLocation;
    }

    public get isSlide(): boolean
    {
        return this._isSlide;
    }

    public get updateInterval(): number
    {
        return this._updateInterval;
    }

    public setUpdateInterval(value: number): void
    {
        this._updateInterval = value;
    }

}
