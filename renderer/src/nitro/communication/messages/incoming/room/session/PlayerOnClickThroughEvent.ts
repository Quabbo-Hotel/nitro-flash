import { IMessageEvent } from '../../../../../../api';
import { MessageEvent } from '../../../../../../events';
import { PlayerOnClickThroughParser } from '../../../parser';


export class PlayerOnClickThroughEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, PlayerOnClickThroughParser);
    }

    public getParser(): PlayerOnClickThroughParser
    {
        return this.parser as PlayerOnClickThroughParser;
    }
}
