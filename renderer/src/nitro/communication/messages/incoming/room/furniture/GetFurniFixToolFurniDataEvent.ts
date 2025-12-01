import { IMessageEvent } from '../../../../../../api';
import { MessageEvent } from '../../../../../../events';
import { GetFurniFixToolFurniDataParser } from '../../../parser/room/furniture/GetFurniFixToolFurniDataParser';

export class GetFurniFixToolFurniDataEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, GetFurniFixToolFurniDataParser);
    }

    public getParser(): GetFurniFixToolFurniDataParser
    {
        return this.parser as GetFurniFixToolFurniDataParser;
    }
}
