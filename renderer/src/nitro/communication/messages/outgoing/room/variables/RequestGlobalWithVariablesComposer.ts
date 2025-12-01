import { IMessageComposer } from '../../../../../../api';

export class RequestGlobalWithVariablesComposer implements IMessageComposer<ConstructorParameters<typeof RequestGlobalWithVariablesComposer>>
{
    private _data: ConstructorParameters<typeof RequestGlobalWithVariablesComposer>;

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