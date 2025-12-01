
import { IMessageDataWrapper } from 'api';
import { Triggerable } from './Triggerable';

export class WiredSelectorDefinition extends Triggerable
{
    private _type: number;
    private _isFiltered: number;
    private _isInverted: number;
    
    constructor(wrapper: IMessageDataWrapper)
    {
        super(wrapper);

        this._type = wrapper.readInt();
        this._isFiltered = wrapper.readInt();
        this._isInverted = wrapper.readInt();
    }

    public get type(): number
    {
        return this._type;
    }

    public get code(): number
    {
        return this._type;
    }

    public get delayInPulses(): number
    {
        // Los selectores no usan delay, siempre retorna 0
        return 0;
    }

    public get isFiltered(): number
    {
        return this._isFiltered;
    }
    
    public get isInverted(): number
    {
        return this._isInverted;
    }

    public get conflictingTriggers(): number[]
    {
        // Los selectores no tienen triggers incompatibles, siempre retorna array vacío
        return [];
    }
}
