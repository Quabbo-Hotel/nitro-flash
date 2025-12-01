import { IMessageComposer } from '../../../../../../api';

export class FurniFixToolBatchSaveMessageComposer implements IMessageComposer<string[]> {
    private _data: string[];

    constructor(batchData: any) {
        const batchDataString = JSON.stringify(batchData);
        this._data = [batchDataString];
    }

    public getMessageArray(): string[] {
        return this._data;
    }

    public dispose(): void {
        this._data = [];
    }
}