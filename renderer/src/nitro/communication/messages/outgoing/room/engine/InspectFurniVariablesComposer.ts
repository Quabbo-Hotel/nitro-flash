import { IMessageComposer } from '../../../../../../api';

export class InspectFurniVariablesComposer implements IMessageComposer<[number, number]>
{
    private _data: [number, number];

    constructor(objectId: number, category: number)
    {
        this._data = [ objectId, category ];
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
