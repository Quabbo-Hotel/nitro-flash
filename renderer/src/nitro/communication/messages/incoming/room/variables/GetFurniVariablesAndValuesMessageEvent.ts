import { IMessageEvent } from '../../../../../../api';
import { MessageEvent } from '../../../../../../events';
import { GetFurniVariablesAndValuesMessageParser } from '../../parser/room/variables/GetFurniVariablesAndValuesMessageParser';

export class GetFurniVariablesAndValuesMessageEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, GetFurniVariablesAndValuesMessageParser);
    }

    public getParser(): GetFurniVariablesAndValuesMessageParser
    {
        return this.parser as GetFurniVariablesAndValuesMessageParser;
    }
}
