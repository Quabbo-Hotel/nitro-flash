import { IMessageComposer } from '../../../../../../api';

export class ToggleFurniInspectionLockComposer implements IMessageComposer<[boolean] | [boolean, number]>
{
    private _data: [boolean] | [boolean, number];

    constructor(enable: boolean, furniId: number = 0)
    {
        this._data = enable ? [ enable, furniId ] : [ enable ];
    }

    public getMessageArray()
    {
        return this._data;
    }

    public dispose(): void
    {
        return;
    }
}
