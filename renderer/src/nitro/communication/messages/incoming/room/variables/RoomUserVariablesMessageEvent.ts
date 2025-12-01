import { IMessageEvent } from '../../../../../../api';
import { MessageEvent } from '../../../../../../events';
import { RoomUserVariablesMessageParser } from '../../parser/room/variables/RoomUserVariablesMessageParser';

export class RoomUserVariablesMessageEvent extends MessageEvent implements IMessageEvent {
    constructor(callback: Function) {
        super(callback, RoomUserVariablesMessageParser);
    }

    public getParser(): RoomUserVariablesMessageParser {
        return this.parser as RoomUserVariablesMessageParser;
    }
}
