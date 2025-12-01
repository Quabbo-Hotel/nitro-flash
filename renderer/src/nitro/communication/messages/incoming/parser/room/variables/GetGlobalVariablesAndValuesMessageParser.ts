import { IMessageDataWrapper, IMessageParser } from '../../../../../../../api';

export class GetGlobalVariablesAndValuesMessageParser implements IMessageParser
{
    private _variables: Map<string, string>;

    public flush(): boolean
    {
        this._variables = new Map();
        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        const count = wrapper.readInt();
        this._variables = new Map();

        for(let i = 0; i < count; i++)
        {
            const name = wrapper.readString();
            const value = wrapper.readString();
            this._variables.set(name, value);
        }

        return true;
    }

    public get variables(): Map<string, string>
    {
        return this._variables;
    }
}
