import { IMessageComposer } from '../../../../../../api';

export class ToggleHighlightModeComposer implements IMessageComposer<ConstructorParameters<typeof ToggleHighlightModeComposer>>
{
    private _data: ConstructorParameters<typeof ToggleHighlightModeComposer>;

    constructor(enable: boolean, variableName: string = '')
    {
        this._data = [ enable, enable ? variableName : '' ];
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



