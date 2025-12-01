import { IMessageDataWrapper, IMessageParser } from '../../../../../../../api';

export interface IFurniVariableAssignmentData
{
    furniId: number;
    virtualId: number;
    value: number | null;
    label: string;
}

export class FurniWithVariablesMessageParser implements IMessageParser
{
    private _variableName: string;
    private _assignments: IFurniVariableAssignmentData[];

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
            const furniId = wrapper.readInt();
            const virtualId = wrapper.readInt();
            const hasValue = wrapper.readBoolean();
            const value = hasValue ? wrapper.readInt() : null;
            const label = wrapper.readString();

            this._assignments.push({
                furniId,
                virtualId,
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

    public get assignments(): IFurniVariableAssignmentData[]
    {
        return this._assignments;
    }
}
