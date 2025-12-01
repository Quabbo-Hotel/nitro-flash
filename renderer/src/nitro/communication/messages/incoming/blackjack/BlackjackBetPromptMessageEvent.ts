import { BlackjackBetPromptParser } from "../../parser";
import { IMessageEvent } from '../../../../../api';
import { MessageEvent } from '../../../../../events';

export class BlackjackBetPromptMessageEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, BlackjackBetPromptParser);
    }

    public getParser(): BlackjackBetPromptParser
    {
        return this.parser as BlackjackBetPromptParser;
    }
}
