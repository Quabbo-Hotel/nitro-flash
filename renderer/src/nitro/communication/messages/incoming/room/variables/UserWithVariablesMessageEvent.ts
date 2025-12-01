import { IMessageEvent } from '../../../../../../api';
import { MessageEvent } from '../../../../../../events';
import { UserWithVariablesMessageParser } from '../../parser/room/variables/UserWithVariablesMessageParser';

export class UserWithVariablesMessageEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, UserWithVariablesMessageParser);
    }

    public getParser(): UserWithVariablesMessageParser
    {
        return this.parser as UserWithVariablesMessageParser;
    }
}
