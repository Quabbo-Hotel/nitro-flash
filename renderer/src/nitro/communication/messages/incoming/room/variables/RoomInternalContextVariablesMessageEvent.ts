import { IMessageEvent } from '../../../../../../api';
import { MessageEvent } from '../../../../../../events';
import { RoomInternalContextVariablesMessageParser } from '../../parser/room/variables/RoomInternalContextVariablesMessageParser';

export class RoomInternalContextVariablesMessageEvent extends MessageEvent implements IMessageEvent {
    constructor(callback: Function) {
        super(callback, RoomInternalContextVariablesMessageParser);
    }

    public getParser(): RoomInternalContextVariablesMessageParser {
        return this.parser as RoomInternalContextVariablesMessageParser;
    }
}
