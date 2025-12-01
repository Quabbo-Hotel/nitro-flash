import { IMessageEvent } from '../../../../../../api';
import { MessageEvent } from '../../../../../../events';
import { GetUserVariablesAndValuesMessageParser } from '../../parser/room/variables/GetUserVariablesAndValuesMessageParser';

export class GetUserVariablesAndValuesMessageEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, GetUserVariablesAndValuesMessageParser);
    }

    public getParser(): GetUserVariablesAndValuesMessageParser
    {
        return this.parser as GetUserVariablesAndValuesMessageParser;
    }
}
