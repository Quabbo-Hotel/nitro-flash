import { IMessageComposer } from '../../../../../../api';


export class FurniFixToolSaveMessageComposer implements IMessageComposer<string[]> {
    private _data: string[];

    constructor(furniData: any) {
        const furniDataString = JSON.stringify(furniData);

        this._data = [furniDataString];
    }

    public getMessageArray(): string[] {
        return this._data;
    }

    public dispose(): void {
        this._data = [];
    }
}
