import { IMessageEvent } from '../../../../../../api';
import { MessageEvent } from '../../../../../../events';
import { RoomInternalUserVariablesMessageParser } from '../../parser/room/variables/RoomInternalUserVariablesMessageParser';

export class RoomInternalUserVariablesMessageEvent extends MessageEvent implements IMessageEvent {
    constructor(callback: Function) {
        super(callback, RoomInternalUserVariablesMessageParser);
    }

    public getParser(): RoomInternalUserVariablesMessageParser {
        return this.parser as RoomInternalUserVariablesMessageParser;
    }
}
