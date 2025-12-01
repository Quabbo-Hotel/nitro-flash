import { IMessageComposer } from '../../../../../../api';


export class KeyboardInputMessageComposer implements IMessageComposer<ConstructorParameters<typeof KeyboardInputMessageComposer>>
{
    private _data: ConstructorParameters<typeof KeyboardInputMessageComposer>;

    constructor(keypressed: string)
    {
        this._data = [keypressed];
    }

    public getMessageArray()
    {
        return this._data;
    }

    public dispose(): void
    {
        return;
    }
}
