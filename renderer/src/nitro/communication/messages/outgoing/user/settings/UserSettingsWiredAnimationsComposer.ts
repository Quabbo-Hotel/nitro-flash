import { IMessageComposer } from '../../../../../../api';

export class UserSettingsWiredAnimationsComposer implements IMessageComposer<ConstructorParameters<typeof UserSettingsWiredAnimationsComposer>>
{
    private _data: ConstructorParameters<typeof UserSettingsWiredAnimationsComposer>;

    constructor(enabled: boolean)
    {
        this._data = [enabled];
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
