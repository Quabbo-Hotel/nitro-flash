import { IMessageComposer } from '../../../../../../api';

// Requests permanent shared variables for a specific owner room
export class RequestSharedRoomVariablesComposer implements IMessageComposer<[number]> {
    private _data: [number];

    constructor(roomId: number) {
        this._data = [ roomId ];
    }

    public getMessageArray() { return this._data; }
    public dispose(): void { return; }
}
