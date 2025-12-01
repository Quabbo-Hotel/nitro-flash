import { IMessageEvent } from '../../../../../api';
import { MessageEvent } from '../../../../../events';
import { AboutAlertParser } from '../../parser/notifications/AboutAlertParser';

export class AboutAlertEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, AboutAlertParser);
    }

    public getParser(): AboutAlertParser
    {
        return this.parser as AboutAlertParser;
    }
}
