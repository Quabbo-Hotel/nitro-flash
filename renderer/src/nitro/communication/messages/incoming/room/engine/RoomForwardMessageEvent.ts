import { IMessageEvent } from '../../../../../../api';
import { MessageEvent } from '../../../../../../events';
import { RoomForwardMessageParser } from '../../../parser';

export class RoomForwardMessageEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, RoomForwardMessageParser);
    }

    public getParser(): RoomForwardMessageParser
    {
        return this.parser as RoomForwardMessageParser;
    }
}
