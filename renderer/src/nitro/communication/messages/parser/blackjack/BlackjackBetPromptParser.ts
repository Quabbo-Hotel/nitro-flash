import { IMessageDataWrapper, IMessageParser } from "api";


export class BlackjackBetPromptParser implements IMessageParser
{
    private _sessionId: number;

    public flush(): boolean
    {
        this._sessionId = -1;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._sessionId = wrapper.readInt();

        return true;
    }

    public get sessionId(): number
    {
        return this._sessionId;
    }
}
