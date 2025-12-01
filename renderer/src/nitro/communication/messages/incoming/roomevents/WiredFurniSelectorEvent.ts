import { IMessageEvent } from '../../../../../api';
import { MessageEvent } from '../../../../../events';
import { WiredFurniSelectorParser } from '../../parser';

export class WiredFurniSelectorEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, WiredFurniSelectorParser);
    }

    public getParser(): WiredFurniSelectorParser
    {
        return this.parser as WiredFurniSelectorParser;
    }
}
