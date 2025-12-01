import { IMessageComposer } from '../../../../../api';

export class BlackjackHitMessageComposer implements IMessageComposer<ConstructorParameters<typeof BlackjackHitMessageComposer>>
{
    private _data: ConstructorParameters<typeof BlackjackHitMessageComposer>;

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
