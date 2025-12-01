import { IMessageComposer } from '../../../../../../api';

export class UserSettingsOldRotationsComposer implements IMessageComposer<ConstructorParameters<typeof UserSettingsOldRotationsComposer>>
{
    private _data: ConstructorParameters<typeof UserSettingsOldRotationsComposer>;

    constructor(value: boolean)
    {
        this._data = [ value ];
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
