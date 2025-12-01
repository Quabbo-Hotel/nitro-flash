import { IMessageComposer } from '../../../../../../api';

export class RequestFurniWithVariablesComposer implements IMessageComposer<ConstructorParameters<typeof RequestFurniWithVariablesComposer>>
{
    private _data: ConstructorParameters<typeof RequestFurniWithVariablesComposer>;

    constructor(variableName: string)
    {
        this._data = [variableName];
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
