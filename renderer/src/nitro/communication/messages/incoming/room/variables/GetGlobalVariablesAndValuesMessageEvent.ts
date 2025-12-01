import { IMessageEvent } from '../../../../../../api';
import { MessageEvent } from '../../../../../../events';
import { GetGlobalVariablesAndValuesMessageParser } from '../../parser/room/variables/GetGlobalVariablesAndValuesMessageParser';

export class GetGlobalVariablesAndValuesMessageEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, GetGlobalVariablesAndValuesMessageParser);
    }

    public getParser(): GetGlobalVariablesAndValuesMessageParser
    {
        return this.parser as GetGlobalVariablesAndValuesMessageParser;
    }
}
