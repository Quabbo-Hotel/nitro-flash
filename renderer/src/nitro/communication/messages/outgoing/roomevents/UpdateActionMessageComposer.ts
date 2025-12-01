import { IMessageComposer } from "api";


export class UpdateActionMessageComposer implements IMessageComposer<unknown[]>
{
    private _data: unknown[];

    constructor(id: number, ints: number[], string: string, stuffs: number[], delay: number,
        furniOptions: number,
        furniType: number,
        userOptions: number,
        userType: number,
        selectionCode: number, destStuffs: number[] = [])
    {
        this._data = [id, ints.length, ...ints, string, stuffs.length, ...stuffs, delay,
            furniOptions,
            furniType,
            userOptions,
            userType,
            selectionCode];
        // Append the optional destination list to the end (action-specific)
        if(destStuffs && destStuffs.length)
        {
            this._data.push(destStuffs.length, ...destStuffs);
        }
        // The composer supports an optional `destStuffs` appended to the end of the message
        // For backwards compatibility we accept it as a property on the `id` param in use cases; otherwise there will be no dests.

        // Append dest stuffs at end if someone passed dests through a property on the same composer type (compat)
        const maybeDest: any = (id as unknown) as any; // no-op: keep typescript safe
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
