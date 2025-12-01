import { IMessageEvent } from '../../../../../../api';
import { MessageEvent } from '../../../../../../events';
import { PlayerWalkKeysParser } from '../../../parser';

export class PlayerWalkKeysEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, PlayerWalkKeysParser);
    }

    public getParser(): PlayerWalkKeysParser
    {
        return this.parser as PlayerWalkKeysParser;
    }
}
