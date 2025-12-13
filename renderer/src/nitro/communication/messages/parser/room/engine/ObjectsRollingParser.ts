import { IMessageDataWrapper, IMessageParser, ObjectRolling, Vector3d } from '../../../../../../api';

export class ObjectsRollingParser implements IMessageParser {
    private _rollerId: number;
    private _itemsRolling: ObjectRolling[];
    private _unitRolling: ObjectRolling;
    private _animationTime: number;

    public flush(): boolean {
        this._rollerId = 0;
        this._itemsRolling = [];
        this._unitRolling = null;
        this._animationTime = 500;
        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean {
        if (!wrapper) return false;
    
        const x = wrapper.readInt();
        const y = wrapper.readInt();
    
        const nextX = wrapper.readInt();
        const nextY = wrapper.readInt();
    
        const totalItems = wrapper.readInt();
        this._animationTime = wrapper.readInt();
        this._itemsRolling = [];
        for (let i = 0; i < totalItems; i++) {
            const id = wrapper.readInt();
            const height = parseFloat(wrapper.readString());
            const nextHeight = parseFloat(wrapper.readString());
            this._itemsRolling.push(new ObjectRolling(id, new Vector3d(x, y, height), new Vector3d(nextX, nextY, nextHeight), null, this._animationTime));
        }
    
        this._rollerId = wrapper.readInt();
    
        if (!wrapper.bytesAvailable) return true;
    
        const movementType = wrapper.readInt();
        const unitId = wrapper.readInt();
        const height = parseFloat(wrapper.readString());
        const nextHeight = parseFloat(wrapper.readString());
    
        switch (movementType) {
            case 0:
                break;
            case 1:
                this._unitRolling = new ObjectRolling(unitId, new Vector3d(x, y, height), new Vector3d(nextX, nextY, nextHeight), ObjectRolling.MOVE, this._animationTime);
                break;
            case 2:
                this._unitRolling = new ObjectRolling(unitId, new Vector3d(x, y, height), new Vector3d(nextX, nextY, nextHeight), ObjectRolling.SLIDE, this._animationTime);
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

    public get animationTime(): number {
        return this._animationTime;
    }
}
