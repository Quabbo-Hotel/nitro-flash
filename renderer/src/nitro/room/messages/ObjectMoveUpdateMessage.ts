import { IVector3D } from '../../../api';
import { RoomObjectUpdateMessage } from '../../../room';

export class ObjectMoveUpdateMessage extends RoomObjectUpdateMessage
{
    private _targetLocation: IVector3D;
    private _isSlide: boolean;
    private _animationTime: number; // Nueva propiedad

    constructor(location: IVector3D, targetLocation: IVector3D, direction: IVector3D, isSlide: boolean = false, animationTime: number = 500)
    {
        super(location, direction);

        this._targetLocation = targetLocation;
        this._isSlide = isSlide;
        this._animationTime = animationTime; // Inicializar nueva propiedad
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

    public get animationTime(): number // Nuevo getter
    {
        return this._animationTime;
    }
}
