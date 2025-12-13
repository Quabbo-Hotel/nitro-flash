import { IVector3D } from '../../../room';

export class ObjectRolling
{
    public static MOVE: string = 'mv';
    public static SLIDE: string = 'sld';

    private _id: number;
    private _location: IVector3D;
    private _targetLocation: IVector3D;
    private _movementType: string;
    private _animationTime: number;

    constructor(id: number, location: IVector3D, targetLocation: IVector3D, movementType: string = null, animationTime: number = 500)
    {
        this._id = id;
        this._location = location;
        console.log(location)
        this._targetLocation = targetLocation;
        this._movementType = movementType;
        this._animationTime = animationTime;
    }

    public get id(): number
    {
        return this._id;
    }

    public get location(): IVector3D
    {
        return this._location;
    }

    public get targetLocation(): IVector3D
    {
        return this._targetLocation;
    }

    public get movementType(): string
    {
        return this._movementType;
    }

    public get animationTime(): number
    {
        return this._animationTime;
    }
}
