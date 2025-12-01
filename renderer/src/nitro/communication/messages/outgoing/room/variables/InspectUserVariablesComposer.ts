import { IMessageComposer } from '../../../../../../api';

export class InspectUserVariablesComposer implements IMessageComposer<[number]>
{
    private _data: [number];

    constructor(userId: number)
    {
        this._data = [ userId ];
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
