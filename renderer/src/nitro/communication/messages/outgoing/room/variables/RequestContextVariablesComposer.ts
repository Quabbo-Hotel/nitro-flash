import { IMessageComposer } from '../../../../../../api';

// Empty request asking the server to send context variable definitions
export class RequestContextVariablesComposer implements IMessageComposer<[]> {
    private _data: [] = [];

    constructor() {}

    public getMessageArray() { return this._data; }
    public dispose(): void { return; }
}
