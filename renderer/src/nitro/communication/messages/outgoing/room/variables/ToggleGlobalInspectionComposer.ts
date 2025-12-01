import { IMessageComposer } from '../../../../../../api';

export class ToggleGlobalInspectionComposer implements IMessageComposer<[boolean]>
{
    private _data: [boolean];

    constructor(enable: boolean)
    {
        this._data = [ enable ];
    }

    public getMessageArray()
    {
        return this._data;
    }

    public dispose(): void
    {
        return;
    }
}
