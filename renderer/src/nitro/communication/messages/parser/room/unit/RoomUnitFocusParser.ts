import { IMessageDataWrapper, IMessageParser } from '../../../../../../api';

export class RoomUnitFocusParser implements IMessageParser
{
    private _unitId: number;
    private _alpha: number;

    public flush(): boolean
    {
        this._unitId = null;
        this._alpha = 255;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._unitId = wrapper.readInt();
        this._alpha = wrapper.readInt();

        return true;
    }

    public get unitId(): number
    {
        return this._unitId;
    }

    public get alpha(): number
    {
        return this._alpha;
    }
}
