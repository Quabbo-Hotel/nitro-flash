import { IMessageComposer } from '../../../../../api';

export class UpdateConditionMessageComposer implements IMessageComposer<unknown[]>
{
    private _data: unknown[];

    constructor(id: number, ints: number[], string: string, stuffs: number[], 
        furniOptions: number,
        furniType: number,
        userOptions: number,
        userType: number,
        allOrOneOptions: number,
        allOrOneType: number)
    {
        this._data = [id, ints.length, ...ints, string, stuffs.length, ...stuffs, furniOptions, furniType, userOptions, userType, allOrOneOptions, allOrOneType];
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
