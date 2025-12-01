import { IMessageDataWrapper, IMessageParser } from '../../../../../api';

export class AboutAlertParser implements IMessageParser
{
    private _username: string;
    private _look: string;
    private _version: string;
    private _onlineUsers: string;
    private _activeRooms: string;
    private _catalogPages: string;
    private _items: string;
    private _furnis: string;
    private _uptime: string;
    private _ramUsage: string;
    private _cpuCores: string;
    private _totalMemory: string;
    private _hotelName: string;

    public flush(): boolean
    {
        this._username = null;
        this._look = null;
        this._version = null;
        this._onlineUsers = null;
        this._activeRooms = null;
        this._catalogPages = null;
        this._items = null;
        this._furnis = null;
        this._uptime = null;
        this._ramUsage = null;
        this._cpuCores = null;
        this._totalMemory = null;
        this._hotelName = null;
        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if (!wrapper) return false;

        this._username = wrapper.readString();
        this._look = wrapper.readString();
        this._version = wrapper.readString();
        this._onlineUsers = wrapper.readString();
        this._activeRooms = wrapper.readString();
        this._catalogPages = wrapper.readString();
        this._items = wrapper.readString();
        this._furnis = wrapper.readString();
        this._uptime = wrapper.readString();
        this._ramUsage = wrapper.readString();
        this._cpuCores = wrapper.readString();
        this._totalMemory = wrapper.readString();
        this._hotelName = wrapper.readString();

        return true;
    }

    public get username(): string
    {
        return this._username;
    }

    public get look(): string
    {
        return this._look;
    }

    public get version(): string
    {
        return this._version;
    }

    public get onlineUsers(): string
    {
        return this._onlineUsers;
    }

    public get activeRooms(): string
    {
        return this._activeRooms;
    }

    public get catalogPages(): string
    {
        return this._catalogPages;
    }

    public get items(): string
    {
        return this._items;
    }

    public get furnis(): string
    {
        return this._furnis;
    }

    public get uptime(): string
    {
        return this._uptime;
    }

    public get ramUsage(): string
    {
        return this._ramUsage;
    }

    public get cpuCores(): string
    {
        return this._cpuCores;
    }

    public get totalMemory(): string
    {
        return this._totalMemory;
    }

    public get hotelName(): string
    {
        return this._hotelName;
    }


}
