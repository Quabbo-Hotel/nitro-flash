import { IVector3D } from '../../../api';
import { RoomObjectUpdateMessage } from '../../../room';

export class ObjectMoveUpdateMessage extends RoomObjectUpdateMessage
{
    public static DEFAULT_ANIMATION_TIME: number = 500;
    private _targetLocation: IVector3D;
    private _isSlide: boolean;
    private _animationTime: number;

    constructor(location: IVector3D, targetLocation: IVector3D, direction: IVector3D, isSlide: boolean = false, animationTime: number = ObjectMoveUpdateMessage.DEFAULT_ANIMATION_TIME)
    {
        super(location, direction);

        this._targetLocation = targetLocation;
        this._isSlide = isSlide;
        this._animationTime = animationTime;
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

    public get animationTime(): number
    {
        return this._animationTime;
    }
}
