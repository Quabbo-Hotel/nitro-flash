import { IMessageComposer } from '../../../../../../api';

export class SaveWiredSettingsComposer
implements
    IMessageComposer<
    ConstructorParameters<typeof SaveWiredSettingsComposer>
    >
{
    private _data: ConstructorParameters<typeof SaveWiredSettingsComposer>;

    constructor(
        roomId: number,
        modifyWired: number,
        inspectWired: number
    )
    {
        //@ts-ignore
        this._data = [];

        this._data.push(
            roomId,
            modifyWired,
            inspectWired
        );
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
