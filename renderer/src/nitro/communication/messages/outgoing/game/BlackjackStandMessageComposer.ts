import { IMessageComposer } from '../../../../../api';

export class BlackjackStandMessageComposer implements IMessageComposer<ConstructorParameters<typeof BlackjackStandMessageComposer>>
{
    private _data: ConstructorParameters<typeof BlackjackStandMessageComposer>;

    constructor(sessionId: number)
    {
        this._data = [sessionId];
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
