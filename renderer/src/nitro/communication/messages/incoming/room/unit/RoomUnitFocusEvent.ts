import { IMessageEvent } from '../../../../../../api';
import { MessageEvent } from '../../../../../../events';
import { RoomUnitFocusParser } from '../../../parser';

export class RoomUnitFocusEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, RoomUnitFocusParser);
    }

    public getParser(): RoomUnitFocusParser
    {
        return this.parser as RoomUnitFocusParser;
    }
}
