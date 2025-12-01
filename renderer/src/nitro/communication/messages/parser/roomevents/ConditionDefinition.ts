import { IMessageDataWrapper } from '../../../../../api';
import { Triggerable } from './Triggerable';

export class ConditionDefinition extends Triggerable
{
    private _type: number;
    private _furniOptions: number;
    private _furniType: number;
    private _userOptions: number;
    private _userType: number;
    private _allOrOneOptions: number;
    private _allOrOneType: number;

    constructor(wrapper: IMessageDataWrapper)
    {
        super(wrapper);

        this._type = wrapper.readInt();
        this._furniOptions = wrapper.readInt();
        this._furniType = wrapper.readInt();
        this._userOptions = wrapper.readInt();
        this._userType = wrapper.readInt();
        this._allOrOneOptions = wrapper.readInt();
        this._allOrOneType = wrapper.readInt();
    }

    public get type(): number
    {
        return this._type;
    }

    public get code(): number
    {
        return this._type;
    }

    public get furniOptions(): number
    {
        return this._furniOptions;
    }
    public get furniType(): number
    {
        return this._furniType;
    }
    public get userOptions(): number
    {
        return this._userOptions;
    }
    public get userType(): number
    {
        return this._userType;
    }
    public get allOrOneOptions(): number
    {
        return this._allOrOneOptions;
    }
    public get allOrOneType(): number
    {
        return this._allOrOneType;
    }
}
