import { IMessageEvent } from '../../../../../../api';
import { MessageEvent } from '../../../../../../events';
import { RoomGlobalVariablesMessageParser } from '../../parser/room/variables/RoomGlobalVariablesMessageParser';

export class RoomGlobalVariablesMessageEvent extends MessageEvent implements IMessageEvent {
    constructor(callback: Function) {
        super(callback, RoomGlobalVariablesMessageParser);
    }

    public getParser(): RoomGlobalVariablesMessageParser {
        return this.parser as RoomGlobalVariablesMessageParser;
    }
}