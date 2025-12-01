import { IMessageComposer } from '../../../../../../api';

export class RequestUserVariablesComposer implements IMessageComposer<[]> {
    private _data: [] = [];

    constructor() {}

    public getMessageArray() { return this._data; }
    public dispose(): void { return; }
}
