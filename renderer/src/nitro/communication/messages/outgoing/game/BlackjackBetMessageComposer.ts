import { IMessageComposer } from '../../../../../api';

export class BlackjackBetMessageComposer implements IMessageComposer<ConstructorParameters<typeof BlackjackBetMessageComposer>>
{
    private _data: ConstructorParameters<typeof BlackjackBetMessageComposer>;

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
