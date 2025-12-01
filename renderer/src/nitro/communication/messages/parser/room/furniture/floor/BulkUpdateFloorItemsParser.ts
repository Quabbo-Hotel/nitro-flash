import { IMessageDataWrapper, IMessageParser } from '../../../../../../../api';
import { FurnitureFloorDataParser } from './FurnitureFloorDataParser';

export class BulkUpdateFloorItemsParser implements IMessageParser
{
    private _items: FurnitureFloorDataParser[];

    constructor()
    {
        this._items = [];
    }

    public flush(): boolean
    {
        this._items = [];
        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if (!wrapper) return false;

        try 
        {
            const itemCount = wrapper.readInt();
            
            for (let i = 0; i < itemCount; i++) 
            {
                // Crear un parser vacío y usar el método parse directamente
                const item = new FurnitureFloorDataParser(wrapper);
                this._items.push(item);
            }
            return true;
        }
        catch (error) 
        {
            console.error('Error parsing BulkUpdateFloorItemsParser:', error);
            console.error('Items processed so far:', this._items.length);
            return false;
        }
    }

    public get items(): FurnitureFloorDataParser[]
    {
        return this._items;
    }
}
