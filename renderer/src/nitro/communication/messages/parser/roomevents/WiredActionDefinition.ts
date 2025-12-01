import { IMessageDataWrapper } from 'api';
import { Triggerable } from './Triggerable';

export class WiredActionDefinition extends Triggerable
{
    private _type: number;
    private _delayInPulses: number;
    private _furniOptions: number;
    private _furniType: number;
    private _userOptions: number;
    private _userType: number;
    private _conflictingTriggers: number[];

    constructor(wrapper: IMessageDataWrapper)
    {
        super(wrapper);

        this._conflictingTriggers = [];
        this._type = wrapper.readInt();
        this._delayInPulses = wrapper.readInt();
        this._furniOptions = wrapper.readInt();
        this._furniType = wrapper.readInt();
        this._userOptions = wrapper.readInt();
        this._userType = wrapper.readInt();

        let count = wrapper.readInt();

        while(count > 0)
        {
            this._conflictingTriggers.push(wrapper.readInt());

            count--;
        }

        // Read destinationSelectedItems if present - action-specific
        try
        {
            let destCount = wrapper.readInt();

            if(destCount >= 0 && destCount <= 50)
            {
                while(destCount > 0)
                {
                    // Append to the base triggerable's stuff ids destination storage
                    // We will keep this as typed "any" at runtime — the Triggerable base doesn't expose dest array, so we store here locally.
                    (this as any)._destinationSelectedItems = (this as any)._destinationSelectedItems || [];
                    (this as any)._destinationSelectedItems.push(wrapper.readInt());
                    destCount--;
                }
            }
            else
            {
                // If destCount is absurd or missing, it's safe to assume no destination items.
            }
        }
        catch(e)
        {
            // optional - ignore if not present
        }
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
        return this._delayInPulses;
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

    public get conflictingTriggers(): number[]
    {
        return this._conflictingTriggers;
    }

    public get destinationSelectedItems(): number[]
    {
        return (this as any)._destinationSelectedItems || [];
    }
}
