
import { BulkUpdateFloorItemsParser } from '../../../../../../../..';
import { IMessageEvent } from '../../../../../../../api';
import { MessageEvent } from '../../../../../../../events';

export class BulkUpdateFloorItemsEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, BulkUpdateFloorItemsParser);
    }

    public getParser(): BulkUpdateFloorItemsParser
    {
        return this.parser as BulkUpdateFloorItemsParser;
    }
}
