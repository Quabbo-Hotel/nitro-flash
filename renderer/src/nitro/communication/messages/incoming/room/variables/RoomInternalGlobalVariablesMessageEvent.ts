import { IMessageEvent } from '../../../../../../api';
import { MessageEvent } from '../../../../../../events';
import { RoomInternalGlobalVariablesMessageParser } from '../../parser/room/variables/RoomInternalGlobalVariablesMessageParser';

export class RoomInternalGlobalVariablesMessageEvent extends MessageEvent implements IMessageEvent {
    constructor(callback: Function) {
        super(callback, RoomInternalGlobalVariablesMessageParser);
    }

    public getParser(): RoomInternalGlobalVariablesMessageParser {
        return this.parser as RoomInternalGlobalVariablesMessageParser;
    }
}