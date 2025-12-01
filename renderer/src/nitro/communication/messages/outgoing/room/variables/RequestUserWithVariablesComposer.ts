import { IMessageComposer } from '../../../../../../api';

export class RequestUserWithVariablesComposer implements IMessageComposer<ConstructorParameters<typeof RequestUserWithVariablesComposer>>
{
    private _data: ConstructorParameters<typeof RequestUserWithVariablesComposer>;

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
