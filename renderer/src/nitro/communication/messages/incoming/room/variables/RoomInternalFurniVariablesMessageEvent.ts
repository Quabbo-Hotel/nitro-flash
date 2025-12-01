import { IMessageEvent } from '../../../../../../api';
import { MessageEvent } from '../../../../../../events';
import { RoomInternalFurniVariablesMessageParser } from '../../parser/room/variables/RoomInternalFurniVariablesMessageParser';

export class RoomInternalFurniVariablesMessageEvent extends MessageEvent implements IMessageEvent {
    constructor(callback: Function) {
        super(callback, RoomInternalFurniVariablesMessageParser);
    }

    public getParser(): RoomInternalFurniVariablesMessageParser {
        return this.parser as RoomInternalFurniVariablesMessageParser;
    }
}
