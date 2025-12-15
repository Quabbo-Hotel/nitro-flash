import { IMessageEvent } from '../../../../../../api';
import { MessageEvent } from '../../../../../../events';
import { BulkObjectsRollingParser } from '../../../parser';

export class BulkObjectsRollingEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, BulkObjectsRollingParser);
    }

    public getParser(): BulkObjectsRollingParser
    {
        return this.parser as BulkObjectsRollingParser;
    }
}
