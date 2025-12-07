import { IMessageEvent } from '../../../../../../api';
import { MessageEvent } from '../../../../../../events';
import { RoomSpotlightOverlayParser } from '../../../parser';

export class RoomSpotlightOverlayEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, RoomSpotlightOverlayParser);
    }

    public getParser(): RoomSpotlightOverlayParser
    {
        return this.parser as RoomSpotlightOverlayParser;
    }
}
