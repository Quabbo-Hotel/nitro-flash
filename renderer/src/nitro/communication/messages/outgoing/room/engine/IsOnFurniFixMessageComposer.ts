import { IMessageComposer } from '../../../../../../api';


export class IsOnFurniFixMessageComposer implements IMessageComposer<ConstructorParameters<typeof IsOnFurniFixMessageComposer>>
{
    private _data: ConstructorParameters<typeof IsOnFurniFixMessageComposer>;

    constructor(isMod: boolean, shouldGetData: boolean)
    {
        this._data = [isMod, shouldGetData];
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
