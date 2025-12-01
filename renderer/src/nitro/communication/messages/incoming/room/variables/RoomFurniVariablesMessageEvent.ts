import { IMessageEvent } from '../../../../../../api';
import { MessageEvent } from '../../../../../../events';
import { RoomFurniVariablesMessageParser } from '../../parser/room/variables/RoomFurniVariablesMessageParser';

export class RoomFurniVariablesMessageEvent extends MessageEvent implements IMessageEvent {
    constructor(callback: Function) {
        super(callback, RoomFurniVariablesMessageParser);
    }

    public getParser(): RoomFurniVariablesMessageParser {
        return this.parser as RoomFurniVariablesMessageParser;
    }
}
