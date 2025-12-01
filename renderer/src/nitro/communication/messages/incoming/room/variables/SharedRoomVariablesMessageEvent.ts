import { IMessageEvent } from '../../../../../../api';
import { MessageEvent } from '../../../../../../events';
import { SharedRoomVariablesMessageParser } from '../../parser/room/variables/SharedRoomVariablesMessageParser';

export class SharedRoomVariablesMessageEvent extends MessageEvent implements IMessageEvent {
    constructor(callback: Function) {
        super(callback, SharedRoomVariablesMessageParser);
    }

    public getParser(): SharedRoomVariablesMessageParser {
        return this.parser as SharedRoomVariablesMessageParser;
    }
}
