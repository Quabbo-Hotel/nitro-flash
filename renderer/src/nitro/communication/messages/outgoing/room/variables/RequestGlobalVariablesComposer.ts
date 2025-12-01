import { IMessageComposer } from '../../../../../../api';

// Empty request asking server to send all room global variables (user + internal)
export class RequestGlobalVariablesComposer implements IMessageComposer<[]> {
    private _data: [] = [];

    constructor() {}

    public getMessageArray() { return this._data; }
    public dispose(): void { return; }
}