import { IMessageDataWrapper, IMessageParser, Vector3d } from '../../../../../../api';

export class BulkObjectsRollingParser implements IMessageParser {
    private _itemSlides: ItemSlideData[] = [];
    private _avatarSlides: AvatarSlideData[] = [];

    public flush(): boolean {
        this._itemSlides = [];
        this._avatarSlides = [];
        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean {
        if (!wrapper) return false;

        const totalSlides = wrapper.readInt();
        
        for (let i = 0; i < totalSlides; i++) {
            const slideType = wrapper.readInt(); // 1 = item, 2 = avatar
            
            if (slideType === 1) {
                // Item slide
                const itemId = wrapper.readInt();
                const fromX = wrapper.readInt();
                const fromY = wrapper.readInt();
                const fromZ = parseFloat(wrapper.readString());
                const toX = wrapper.readInt();
                const toY = wrapper.readInt();
                const toZ = parseFloat(wrapper.readString());
                const animationTime = wrapper.readInt();
                
                this._itemSlides.push({
                    itemId,
                    from: new Vector3d(fromX, fromY, fromZ),
                    to: new Vector3d(toX, toY, toZ),
                    animationTime
                });
            } else if (slideType === 2) {
                // Avatar slide
                const avatarId = wrapper.readInt();
                const rollerId = wrapper.readInt();
                const fromX = wrapper.readInt();
                const fromY = wrapper.readInt();
                const fromZ = parseFloat(wrapper.readString());
                const toX = wrapper.readInt();
                const toY = wrapper.readInt();
                const toZ = parseFloat(wrapper.readString());
                const animationTime = wrapper.readInt();
                let avatarStatus = wrapper.readString();
                
                if (avatarStatus.length === 0) {
                    avatarStatus = null;
                }
                
                this._avatarSlides.push({
                    avatarId,
                    rollerId,
                    from: new Vector3d(fromX, fromY, fromZ),
                    to: new Vector3d(toX, toY, toZ),
                    animationTime,
                    avatarStatus
                });
            }
        }
        
        return true;
    }

    public get itemSlides(): ItemSlideData[] {
        return this._itemSlides;
    }

    public get avatarSlides(): AvatarSlideData[] {
        return this._avatarSlides;
    }
}

export interface ItemSlideData {
    itemId: number;
    from: Vector3d;
    to: Vector3d;
    animationTime: number;
}

export interface AvatarSlideData {
    avatarId: number;
    rollerId: number;
    from: Vector3d;
    to: Vector3d;
    animationTime: number;
    avatarStatus: string;
}