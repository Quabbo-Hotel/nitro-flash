import { IMessageDataWrapper, IMessageParser } from '../../../../../../../api';

export class GetFurniVariablesAndValuesMessageParser implements IMessageParser
{
    private _furniId: number;
    private _virtualId: number;
    private _variables: Map<string, string>;


    public flush(): boolean
    {
        this._furniId = 0;
        this._virtualId = 0;
        this._variables = new Map();
        
        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        this._furniId = wrapper.readInt();
        this._virtualId = wrapper.readInt();
        const count = wrapper.readInt();
        this._variables = new Map();

        for (let i = 0; i < count; i++)
        {
            const name = wrapper.readString();
            const value = wrapper.readString();
            this._variables.set(name, value);
        }

        return true;
    }

    public get furniId(): number
    {
        return this._furniId;
    }

    public get variables(): Map<string, string>
    {
        return this._variables;
    }
    public get virtualId(): number
    {
        return this._virtualId;
    }
}
