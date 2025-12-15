import { IMessageDataWrapper, IMessageParser, ObjectRolling, Vector3d } from '../../../../../../api';

export class ObjectsRollingParser implements IMessageParser {
    private _rollerId: number;
    private _itemsRolling: ObjectRolling[];
    private _unitRolling: ObjectRolling;
    private _unitAnimationTime: number;
    private _itemsAnimationTime: number;

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
            this._itemsRolling.push(new ObjectRolling(id, new Vector3d(x, y, height), new Vector3d(nextX, nextY, nextHeight)));
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
    
        switch (movementType) {
            case 0:
                break;
            case 1:
                this._unitRolling = new ObjectRolling(unitId, new Vector3d(x, y, height), new Vector3d(nextX, nextY, nextHeight), ObjectRolling.MOVE);
                this._unitAnimationTime = animationTime;
                break;
            case 2:
                this._unitRolling = new ObjectRolling(unitId, new Vector3d(x, y, height), new Vector3d(nextX, nextY, nextHeight), ObjectRolling.SLIDE);
                this._unitAnimationTime = animationTime;
                break;
        }
    
        return true;
    }
    

    public get rollerId(): number {
        return this._rollerId;
    }

    public get itemsRolling(): ObjectRolling[] {
        return this._itemsRolling;
    }

    public get unitRolling(): ObjectRolling {
        return this._unitRolling;
    }

    public get unitAnimationTime(): number {
        return this._unitAnimationTime;
    }

    public get itemsAnimationTime(): number {
        return this._itemsAnimationTime;
    }
}
