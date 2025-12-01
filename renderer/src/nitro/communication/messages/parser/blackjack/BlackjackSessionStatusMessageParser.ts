import { IMessageDataWrapper, IMessageParser } from "api";


export class BlackjackSessionStatusParser implements IMessageParser
{
    private _sessionId: number;
    private _botId: number;
    private _data: string;

    public flush(): boolean
    {
        this._sessionId = -1;
        this._botId = -1;
        this._data = '';

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;
this._sessionId = wrapper.readInt();
        this._botId = wrapper.readInt();
        
        this._data = wrapper.readString();

        return true;
    }

    public get sessionId(): number
    {
        return this._sessionId;
    }
    public get botId(): number
    {
        return this._botId;
    }

    public get data(): string
    {
        return this._data;
    }
}
