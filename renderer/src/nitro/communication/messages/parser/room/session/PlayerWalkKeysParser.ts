import { IMessageDataWrapper, IMessageParser } from '../../../../../../api';

export class PlayerWalkKeysParser implements IMessageParser
{
    private _isEnabled: boolean = false;

    public flush(): boolean
    {
        this._isEnabled = false;
        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._isEnabled = wrapper.readBoolean();
        return true;
    }

    public get isEnabled(): boolean
    {
        return this._isEnabled;
    }
}
