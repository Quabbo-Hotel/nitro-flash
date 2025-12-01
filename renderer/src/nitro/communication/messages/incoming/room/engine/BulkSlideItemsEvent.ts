import { IMessageEvent } from '../../../../../../api';
import { MessageEvent } from '../../../../../../events';
import { BulkSlideItemsParser } from '../../../parser';

export class BulkSlideItemsEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, BulkSlideItemsParser);
    }

    public getParser(): BulkSlideItemsParser
    {
        return this.parser as BulkSlideItemsParser;
    }
}
