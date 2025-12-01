import { IMessageDataWrapper, IMessageParser } from '../../../../../../../api';

export class GetUserVariablesAndValuesMessageParser implements IMessageParser
{
    private _userId: number;
    private _roomIndex: number;
    private _figure: string;
    private _variables: Map<string, string>;

    public flush(): boolean
    {
        this._userId = 0;
        this._roomIndex = 0;
        this._figure = '';
        this._variables = new Map();
        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        this._userId = wrapper.readInt();
        this._roomIndex = wrapper.readInt();
        this._figure = wrapper.readString();
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

    public get userId(): number
    {
        return this._userId;
    }

    public get roomIndex(): number
    {
        return this._roomIndex;
    }

    public get figure(): string
    {
        return this._figure;
    }

    public get variables(): Map<string, string>
    {
        return this._variables;
    }
}
