import { IMessageDataWrapper, IMessageParser } from '../../../../../../api';


export class BulkSlideItemsParser implements IMessageParser
{
    private _itemSlides: Array<{
        virtualId: number;
        fromX: number;
        fromY: number;
        fromZ: string;
        toX: number;
        toY: number;
        toZ: string;
        fromRotation: number;
        toRotation: number;
    }>;


    constructor()
    {
        this._itemSlides = [];
    }

    public flush(): boolean {
        this._itemSlides = [];
        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean {
        if(!wrapper) return false;

        const itemCount = wrapper.readInt();
        this._itemSlides = [];

        for(let i = 0; i < itemCount; i++) {
            const virtualId = wrapper.readInt();
            const fromX = wrapper.readInt();
            const fromY = wrapper.readInt();
            const fromZ = wrapper.readString();
            const toX = wrapper.readInt();
            const toY = wrapper.readInt();
            const toZ = wrapper.readString();
            const fromRotation = wrapper.readInt();
            const toRotation = wrapper.readInt();

            this._itemSlides.push({
                virtualId,
                fromX,
                fromY,
                fromZ,
                toX,
                toY,
                toZ,
                fromRotation,
                toRotation
            });
        }

        return true;
    }

    public get itemSlides(): Array<{
        virtualId: number;
        fromX: number;
        fromY: number;
        fromZ: string;
        toX: number;
        toY: number;
        toZ: string;
        fromRotation: number;
        toRotation: number;
    }>
    {
        return this._itemSlides;
    }
}
