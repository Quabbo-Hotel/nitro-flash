import { IMessageDataWrapper, IMessageParser } from '../../../../../../../api';

export interface IUserVariableAssignmentData
{
    userId: number;
    roomIndex: number;
    value: number | null;
    label: string;
}

export class UserWithVariablesMessageParser implements IMessageParser
{
    private _variableName: string;
    private _assignments: IUserVariableAssignmentData[];

    public flush(): boolean
    {
        this._variableName = '';
        this._assignments = [];
        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._variableName = wrapper.readString();
        const count = wrapper.readInt();
        this._assignments = [];

        for(let i = 0; i < count; i++)
        {
            const userId = wrapper.readInt();
            const roomIndex = wrapper.readInt();
            const hasValue = wrapper.readBoolean();
            const value = hasValue ? wrapper.readInt() : null;
            const label = wrapper.readString();

            this._assignments.push({
                userId,
                roomIndex,
                value,
                label
            });
        }

        return true;
    }

    public get variableName(): string
    {
        return this._variableName;
    }

    public get assignments(): IUserVariableAssignmentData[]
    {
        return this._assignments;
    }
}
