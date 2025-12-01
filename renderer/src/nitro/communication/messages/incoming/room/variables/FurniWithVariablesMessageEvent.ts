import { IMessageEvent } from '../../../../../../api';
import { MessageEvent } from '../../../../../../events';
import { FurniWithVariablesMessageParser } from '../../parser/room/variables/FurniWithVariablesMessageParser';

export class FurniWithVariablesMessageEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, FurniWithVariablesMessageParser);
    }

    public getParser(): FurniWithVariablesMessageParser
    {
        return this.parser as FurniWithVariablesMessageParser;
    }
}
