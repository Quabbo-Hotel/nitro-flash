import { IMessageDataWrapper, IMessageParser, BulkObjectRolling, Vector3d } from '../../../../../../api';

export class BulkObjectsRollingParser implements IMessageParser {
    private _rollerId: number;
    private _itemsRolling: BulkObjectRolling[];
    private _unitRolling: BulkObjectRolling;
    private _unitAnimationTime: number;
    private _itemsAnimationTime: number;
    private _unitStatus: string;

    public flush(): boolean {
        this._rollerId = 0;
        this._itemsRolling = [];
        this._unitRolling = null;
        this._unitAnimationTime = 0;
        this._itemsAnimationTime = 0;
        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean {
        if (!wrapper) return false;
    
        const x = wrapper.readInt();
        const y = wrapper.readInt();
    
        const nextX = wrapper.readInt();
        const nextY = wrapper.readInt();
    
        const totalItems = wrapper.readInt();
        this._itemsRolling = [];
        for (let i = 0; i < totalItems; i++) {
            const id = wrapper.readInt();
            const height = parseFloat(wrapper.readString());
            const nextHeight = parseFloat(wrapper.readString());
            this._itemsRolling.push(new BulkObjectRolling(id, new Vector3d(x, y, height), new Vector3d(nextX, nextY, nextHeight)));
        }

        // Read optional animationTime for items (server writes it after items count)
        let itemsAnimationTime = 0;
        if (wrapper.bytesAvailable) {
            itemsAnimationTime = wrapper.readInt();
        }
        this._itemsAnimationTime = itemsAnimationTime;

        this._rollerId = wrapper.readInt();
    
        if (!wrapper.bytesAvailable) return true;

        const movementType = wrapper.readInt();
        const unitId = wrapper.readInt();
        const height = parseFloat(wrapper.readString());
        const nextHeight = parseFloat(wrapper.readString());
        let animationTime = 0;
        if (wrapper.bytesAvailable) {
            // New optional int specifying animation duration (ms)
            animationTime = wrapper.readInt();
        }

        // Optional avatar status string (like "sit 0.6" or "lay 0")
        let unitStatus: string = null;
        if (wrapper.bytesAvailable) {
            try {
                unitStatus = wrapper.readString();
            } catch (e) {
                unitStatus = null;
            }
        }
        this._unitStatus = unitStatus;
    
        switch (movementType) {
            case 0:
                break;
            case 1:
                this._unitRolling = new BulkObjectRolling(unitId, new Vector3d(x, y, height), new Vector3d(nextX, nextY, nextHeight), BulkObjectRolling.MOVE);
                this._unitAnimationTime = animationTime;
                break;
            case 2:
                this._unitRolling = new BulkObjectRolling(unitId, new Vector3d(x, y, height), new Vector3d(nextX, nextY, nextHeight), BulkObjectRolling.SLIDE);
                this._unitAnimationTime = animationTime;
                break;
        }
    
        return true;
    }
    

    public get rollerId(): number {
        return this._rollerId;
    }

    public get itemsRolling(): BulkObjectRolling[] {
        return this._itemsRolling;
    }

    public get unitRolling(): BulkObjectRolling {
        return this._unitRolling;
    }

    public get unitAnimationTime(): number {
        return this._unitAnimationTime;
    }

    public get itemsAnimationTime(): number {
        return this._itemsAnimationTime;
    }

    public get unitStatus(): string {
        return this._unitStatus;
    }
}
