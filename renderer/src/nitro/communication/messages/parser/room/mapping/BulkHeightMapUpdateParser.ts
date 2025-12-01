import { IMessageDataWrapper, IMessageParser } from '../../../../../../api';

export interface BulkHeightMapUpdateItem {
    x: number;
    y: number;
    height: number;
}

export class BulkHeightMapUpdateParser implements IMessageParser {
    private _items: BulkHeightMapUpdateItem[] = [];

    public flush(): boolean {
        this._items = [];
        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean {
        this._items = [];
        const count = wrapper.readByte();
        for(let i = 0; i < count; i++) {
            const x = wrapper.readByte();
            const y = wrapper.readByte();
            const height = wrapper.readShort() / 256;
            this._items.push({ x, y, height });
        }
        return true;
    }

    public get items(): BulkHeightMapUpdateItem[] {
        return this._items;
    }
}
