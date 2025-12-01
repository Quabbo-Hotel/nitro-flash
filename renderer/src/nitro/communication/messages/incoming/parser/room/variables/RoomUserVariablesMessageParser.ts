import { IMessageDataWrapper } from '../../../../../../../api';
import { IVariableTextEntry } from './RoomFurniVariablesMessageParser';

export interface IUserUserVariableData {
    name: string;
    availability: string;
    hasValue: boolean;
    canWriteTo: boolean;
    canCreateDelete: boolean;
    isAlwaysAvailable: boolean;
    hasCreationTime: boolean;
    hasUpdateTime: boolean;
    isTextConnected: boolean;
    userId: number;
    hasRuntimeValue: boolean;
    runtimeValue?: string;
    creationTimestamp?: number;
    updateTimestamp?: number;
    textEntries: IVariableTextEntry[];
}

export class RoomUserVariablesMessageParser {
    private _vars: IUserUserVariableData[] = [];

    public flush(): boolean {
        this._vars = [];
        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean {
        if(!wrapper) return false;
        const count = wrapper.readInt();
        for(let i=0;i<count;i++) {
            const name = wrapper.readString();
            const availability = wrapper.readString();
            const hasValue = wrapper.readBoolean();
            const canWriteTo = wrapper.readBoolean();
            const canCreateDelete = wrapper.readBoolean();
            const isAlwaysAvailable = wrapper.readBoolean();
            const hasCreationTime = wrapper.readBoolean();
            const hasUpdateTime = wrapper.readBoolean();
            const isTextConnected = wrapper.readBoolean();
            const userId = wrapper.readInt();
            const hasRuntimeValue = wrapper.readBoolean();
            let runtimeValue: string | undefined;
            if(hasRuntimeValue) runtimeValue = wrapper.readString();
            const creationStamp = wrapper.readString();
            const updateStamp = wrapper.readString();
            const creationTimestamp = creationStamp.length ? Number(creationStamp) : undefined;
            const updateTimestamp = updateStamp.length ? Number(updateStamp) : undefined;
            const entryCount = wrapper.readInt();
            const textEntries: IVariableTextEntry[] = [];
            for(let j = 0; j < entryCount; j++) {
                const index = wrapper.readInt();
                const text = wrapper.readString();
                textEntries.push({ index, text });
            }
            this._vars.push({ name, availability, hasValue, canWriteTo, canCreateDelete, isAlwaysAvailable, hasCreationTime, hasUpdateTime, isTextConnected, userId, hasRuntimeValue, runtimeValue, creationTimestamp, updateTimestamp, textEntries });
        }
        return true;
    }

    public get vars(): IUserUserVariableData[] { return this._vars; }
}
