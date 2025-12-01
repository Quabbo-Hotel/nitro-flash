import { IMessageComposer } from '../../../../../../api';

export class ToggleUserInspectionLockComposer implements IMessageComposer<[boolean] | [boolean, number]>
{
    private _data: [boolean] | [boolean, number];

    constructor(enable: boolean, userId: number = 0)
    {
        this._data = enable ? [ enable, userId ] : [ enable ];
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
