import { IMessageComposer } from '../../../../../../api';

// Empty request asking server to send all room furni variables (user + internal)
export class RequestRoomVariablesComposer implements IMessageComposer<[]> {
    private _data: [] = [];

    constructor() {}

    public getMessageArray() { return this._data; }
    public dispose(): void { return; }
}
