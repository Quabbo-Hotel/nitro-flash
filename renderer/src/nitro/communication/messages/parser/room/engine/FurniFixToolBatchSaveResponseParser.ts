import { IMessageDataWrapper, IMessageParser } from '../../../../../../api';

export class FurniFixToolBatchSaveResponseParser implements IMessageParser
{
    private _success: boolean;
    private _processedCount: number;
    private _message: string;

    public flush(): boolean
    {
        this._success = false;
        this._processedCount = 0;
        this._message = '';

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._success = wrapper.readBoolean();
        this._processedCount = wrapper.readInt();
        this._message = wrapper.readString();

        return true;
    }

    public get success(): boolean
    {
        return this._success;
    }

    public get processedCount(): number
    {
        return this._processedCount;
    }

    public get message(): string
    {
        return this._message;
    }
}