import { IMessageDataWrapper, IMessageParser } from '../../../../../../api';


export class BulkSlideUsersAndItemsParser implements IMessageParser
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
    private _userSlides: Array<{
        roomIndex: number;
        fromX: number;
        fromY: number;
        fromZ: string;
        toX: number;
        toY: number;
        toZ: string;
    }>;


    constructor()
    {
        this._itemSlides = [];
        this._userSlides = [];
    }

    public flush(): boolean {
        this._itemSlides = [];
        this._userSlides = [];
        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean {
        if(!wrapper) return false;

        const itemCount = wrapper.readInt();
        const userCount = wrapper.readInt();
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

        this._userSlides = [];

        for(let i = 0; i < userCount; i++) {
            const roomIndex = wrapper.readInt();
            const fromX = wrapper.readInt();
            const fromY = wrapper.readInt();
            const fromZ = wrapper.readString();
            const toX = wrapper.readInt();
            const toY = wrapper.readInt();
            const toZ = wrapper.readString();

            this._userSlides.push({
                roomIndex,
                fromX,
                fromY,
                fromZ,
                toX,
                toY,
                toZ
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

    public get userSlides(): Array<{
        roomIndex: number;
        fromX: number;
        fromY: number;
        fromZ: string;
        toX: number;
        toY: number;
        toZ: string;
    }>
    {
        return this._userSlides;
    }
}
