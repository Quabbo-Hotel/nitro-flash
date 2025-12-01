import { IMessageEvent } from '../../../../../../api';
import { MessageEvent } from '../../../../../../events';
import { PlayerVimKeysParser } from '../../../parser';

export class PlayerVimKeysEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, PlayerVimKeysParser);
    }

    public getParser(): PlayerVimKeysParser
    {
        return this.parser as PlayerVimKeysParser;
    }
}