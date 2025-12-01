import { IMessageDataWrapper } from '../../../../../../../api';

export interface ISharedRoomVariableEntry {
    name: string;
    target: 0 | 1; // 0 = global, 1 = user
    hasValue: boolean;
    canWrite: boolean;
}

export class SharedRoomVariablesMessageParser {
    private _roomId = 0;
    private _roomName = '';
    private _entries: ISharedRoomVariableEntry[] = [];

    public flush(): boolean {
        this._roomId = 0;
        this._roomName = '';
        this._entries = [];
        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean {
        if(!wrapper) return false;

        this._roomId = wrapper.readInt();
        this._roomName = wrapper.readString();
        const count = wrapper.readInt();
        this._entries = [];

        for(let i = 0; i < count; i++) {
            const name = wrapper.readString();
            const targetCode = wrapper.readInt();
            const hasValue = wrapper.readBoolean();
            const canWrite = wrapper.readBoolean();

            this._entries.push({
                name,
                target: (targetCode === 1 ? 1 : 0),
                hasValue,
                canWrite
            });
        }

        return true;
    }

    public get roomId(): number { return this._roomId; }
    public get roomName(): string { return this._roomName; }
    public get entries(): ISharedRoomVariableEntry[] { return this._entries; }
}
