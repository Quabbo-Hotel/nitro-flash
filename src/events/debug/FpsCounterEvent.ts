import { NitroEvent } from '@nitrots/nitro-renderer';

export class FpsCounterEvent extends NitroEvent
{
    public static readonly TOGGLE: string = 'FCE_TOGGLE';

    constructor(type: string, public readonly visible?: boolean)
    {
        super(type);
    }
}
