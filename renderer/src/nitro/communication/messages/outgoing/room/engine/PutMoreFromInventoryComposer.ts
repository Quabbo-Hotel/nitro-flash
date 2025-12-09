import { IMessageComposer } from '../../../../../../api';

export class PutMoreFromInventoryComposer implements IMessageComposer<ConstructorParameters<typeof PutMoreFromInventoryComposer>>
{
    private _data: ConstructorParameters<typeof PutMoreFromInventoryComposer>;

    constructor(baseItemId: number)
    {
        this._data = [ baseItemId ];
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
