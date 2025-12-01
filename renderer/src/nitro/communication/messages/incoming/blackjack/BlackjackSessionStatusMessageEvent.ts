import { BlackjackSessionStatusParser } from "../../parser";
import { IMessageEvent } from '../../../../../api';
import { MessageEvent } from '../../../../../events';

export class BlackjackSessionStatusMessageEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, BlackjackSessionStatusParser);
    }

    public getParser(): BlackjackSessionStatusParser
    {
        return this.parser as BlackjackSessionStatusParser;
    }
}
