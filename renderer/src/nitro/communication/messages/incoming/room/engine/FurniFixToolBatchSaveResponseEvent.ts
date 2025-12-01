import { IMessageEvent } from '../../../../../../api';
import { MessageEvent } from '../../../../../../events';
import { FurniFixToolBatchSaveResponseParser } from '../../../parser/room/engine/FurniFixToolBatchSaveResponseParser';


export class FurniFixToolBatchSaveResponseEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, FurniFixToolBatchSaveResponseParser);
    }

    public getParser(): FurniFixToolBatchSaveResponseParser
    {
        return this.parser as FurniFixToolBatchSaveResponseParser;
    }
}
