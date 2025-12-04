import { IMessageComposer } from '../../../../../../api';

export class UserSettingsMouseWheelZoomComposer implements IMessageComposer<ConstructorParameters<typeof UserSettingsMouseWheelZoomComposer>>
{
    private _data: ConstructorParameters<typeof UserSettingsMouseWheelZoomComposer>;

    constructor(enabled: boolean)
    {
        this._data = [ enabled ];
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
