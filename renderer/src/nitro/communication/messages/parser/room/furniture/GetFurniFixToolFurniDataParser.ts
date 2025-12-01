import { IMessageDataWrapper, IMessageParser } from '../../../../../../api';

export class GetFurniFixToolFurniDataParser implements IMessageParser {
    private _id: number;
    private _spriteId: number;
    private _publicName: string;
    private _itemName: string;
    private _width: number;
    private _length: number;
    private _stackHeight: number;
    private _canStack: number;
    private _canSit: number;
    private _isWalkable: number;
    private _allowGift: number;
    private _allowTrade: number;
    private _allowRecycle: number;
    private _allowMarketplaceSell: number;
    private _interactionType: string;
    private _interactionModesCount: number;
    private _vendingIds: string;
    private _variableHeights: string;

    // catalog
    private _pageId: number;
    private _catalogName: string;
    private _costCredits: number;
    private _costPixels: number;
    private _costDiamonds: number;
    private _amount: number;
    private _orderNum: number;
    private _flatId: number;


    public flush(): boolean {
        this._id = 0;
        this._spriteId = 0;
        this._publicName = "";
        this._itemName = "";
        this._width = 0;
        this._length = 0;
        this._stackHeight = 0;
        this._canStack = 0;
        this._canSit = 0;
        this._isWalkable = 0;
        this._allowGift = 0;
        this._allowTrade = 0;
        this._allowRecycle = 0;
        this._allowMarketplaceSell = 0;
        this._interactionType = "";
        this._interactionModesCount = 0;
        this._vendingIds = "";
        this._variableHeights = "";
        this._pageId = 0;
        this._catalogName = "";
        this._costCredits = 0;
        this._costPixels = 0;
        this._costDiamonds = 0;
        this._amount = 0;
        this._orderNum = 0;
        this._flatId = 0;
        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean {
        
        if (!wrapper) {
            return false;
        }

        try {
            this._id = parseInt(wrapper.readString());
            this._spriteId = parseInt(wrapper.readString());
            this._publicName = wrapper.readString();
            this._itemName = wrapper.readString();
            this._width = parseInt(wrapper.readString());
            this._length = parseInt(wrapper.readString());
            this._stackHeight = parseFloat(wrapper.readString());
            this._canStack = parseInt(wrapper.readString());
            this._canSit = parseInt(wrapper.readString());
            this._isWalkable = parseInt(wrapper.readString());
            this._allowGift = parseInt(wrapper.readString());
            this._allowTrade = parseInt(wrapper.readString());
            this._allowRecycle = parseInt(wrapper.readString());
            this._allowMarketplaceSell = parseInt(wrapper.readString());
            this._interactionType = wrapper.readString();
            this._interactionModesCount = parseInt(wrapper.readString());
            this._vendingIds = wrapper.readString();
            this._variableHeights = wrapper.readString();
            this._pageId = parseInt(wrapper.readString());
            this._catalogName = wrapper.readString();
            this._costCredits = parseInt(wrapper.readString());
            this._costPixels = parseInt(wrapper.readString());
            this._costDiamonds = parseInt(wrapper.readString());
            this._amount = parseInt(wrapper.readString());
            this._orderNum = parseInt(wrapper.readString());
            
            this._flatId = parseInt(wrapper.readString());
            

            return true;
        } catch (error) {
            console.error("ERROR in GetFurniFixToolFurniDataParser.parse():", error);
            return false;
        }
    }

    // Getters para acceder a los valores:
    public get id(): number { return this._id; }
    public get spriteId(): number { return this._spriteId; }
    public get publicName(): string { return this._publicName; }
    public get itemName(): string { return this._itemName; }
    public get width(): number { return this._width; }
    public get length(): number { return this._length; }
    public get stackHeight(): number { return this._stackHeight; }
    public get canStack(): number { return this._canStack; }
    public get canSit(): number { return this._canSit; }
    public get isWalkable(): number { return this._isWalkable; }
    public get allowGift(): number { return this._allowGift; }
    public get allowTrade(): number { return this._allowTrade; }
    public get allowRecycle(): number { return this._allowRecycle; }
    public get allowMarketplaceSell(): number { return this._allowMarketplaceSell; }
    public get interactionType(): string { return this._interactionType; }
    public get interactionModesCount(): number { return this._interactionModesCount; }
    public get vendingIds(): string { return this._vendingIds; }
    public get variableHeights(): string { return this._variableHeights; }
    public get pageId(): number { return this._pageId; }
    public get catalogName(): string { return this._catalogName; }
    public get costCredits(): number { return this._costCredits; }
    public get costPixels(): number { return this._costPixels; }
    public get costDiamonds(): number { return this._costDiamonds; }
    public get amount(): number { return this._amount; }
    public get orderNum(): number { return this._orderNum; }
    public get flatId(): number { return this._flatId; }
}
