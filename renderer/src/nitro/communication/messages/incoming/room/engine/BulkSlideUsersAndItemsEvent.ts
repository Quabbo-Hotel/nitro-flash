import { IMessageEvent } from '../../../../../../api';
import { MessageEvent } from '../../../../../../events';
import { BulkSlideUsersAndItemsParser } from '../../../parser';

export class BulkSlideUsersAndItemsEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, BulkSlideUsersAndItemsParser);
    }

    public getParser(): BulkSlideUsersAndItemsParser
    {
        return this.parser as BulkSlideUsersAndItemsParser;
    }
}
