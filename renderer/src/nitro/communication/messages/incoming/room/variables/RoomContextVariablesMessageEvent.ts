import { IMessageEvent } from '../../../../../../api';
import { MessageEvent } from '../../../../../../events';
import { RoomContextVariablesMessageParser } from '../../parser/room/variables/RoomContextVariablesMessageParser';

export class RoomContextVariablesMessageEvent extends MessageEvent implements IMessageEvent {
    constructor(callback: Function) {
        super(callback, RoomContextVariablesMessageParser);
    }

    public getParser(): RoomContextVariablesMessageParser {
        return this.parser as RoomContextVariablesMessageParser;
    }
}
