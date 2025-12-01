import { IMessageComposer } from '../../../../../api';

export class BlackjackJoinQueueWithBetMessageComposer implements IMessageComposer<ConstructorParameters<typeof BlackjackJoinQueueWithBetMessageComposer>>
{
    private _data: ConstructorParameters<typeof BlackjackJoinQueueWithBetMessageComposer>;

    constructor(sessionId: number, betAmount: number)
    {
        this._data = [sessionId, betAmount];
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
