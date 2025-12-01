import { NotificationAlertType } from './NotificationAlertType';

export class NotificationAlertItem {
    private static ITEM_ID: number = -1;

    private _id: number;
    private _messages: string[];
    private _alertType: string;
    private _clickUrl: string;
    private _clickUrlText: string;
    private _title: string;
    private _imageUrl: string;
    private _roomId: number;
    private _roomName: string;
    private _username: string;
    private _look: string;
    private _message: string;
    private _typeGalert: string;
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

    constructor(
        messages: string[],
        alertType: string = NotificationAlertType.DEFAULT,
        clickUrl: string = null,
        clickUrlText: string = null,
        title: string = null,
        imageUrl: string = null,
        roomId: number = null,
        roomName: string = null,
        username: string = null,
        look: string = null,
        message: string = null,
        typeGalert: string = null,
        version: string = null,
        onlineUsers: string = null,
        activeRooms: string = null,
        catalogPages: string = null,
        items: string = null,
        furnis: string = null,
        uptime: string = null,
        ramUsage: string = null,
        cpuCores: string = null,
        totalMemory: string = null,
        hotelName: string = null
  
    ) {
        NotificationAlertItem.ITEM_ID += 1;

        this._id = NotificationAlertItem.ITEM_ID;
        this._messages = messages;
        this._alertType = alertType;
        this._clickUrl = clickUrl;
        this._clickUrlText = clickUrlText;
        this._title = title;
        this._imageUrl = imageUrl;
        this._roomId = roomId;
        this._roomName = roomName;
        this._username = username;
        this._look = look;
        this._message = message;
        this._typeGalert = typeGalert;
        this._version = version;
        this._onlineUsers = onlineUsers;
        this._activeRooms = activeRooms;
        this._catalogPages = catalogPages;
        this._items = items;
        this._furnis = furnis;
        this._uptime = uptime;
        this._ramUsage = ramUsage;
        this._cpuCores = cpuCores;
        this._totalMemory = totalMemory;
        this._hotelName = hotelName;

    }

    public get id(): number {
        return this._id;
    }

    public get messages(): string[] {
        return this._messages;
    }

    public get alertType(): string {
        return this._alertType;
    }

    public get clickUrl(): string {
        return this._clickUrl;
    }

    public get clickUrlText(): string {
        return this._clickUrlText;
    }

    public get title(): string {
        return this._title;
    }

    public get imageUrl(): string {
        return this._imageUrl;
    }

    public get roomId(): number {
        return this._roomId;
    }

    public get roomName(): string {
        return this._roomName;
    }
    public get username(): string {
        return this._username;
    }
    public get look(): string {
        return this._look;
    }

    public get message(): string {
        return this._message;
    }
    public get typeGalert(): string {
        return this._typeGalert;
    }
    public get version(): string {
    return this._version;
}

public get onlineUsers(): string {
    return this._onlineUsers;
}

public get activeRooms(): string {
    return this._activeRooms;
}

public get catalogPages(): string {
    return this._catalogPages;
}

public get items(): string {
    return this._items;
}

public get furnis(): string {
    return this._furnis;
}

public get uptime(): string {
    return this._uptime;
}

public get ramUsage(): string {
    return this._ramUsage;
}

public get cpuCores(): string {
    return this._cpuCores;
}

public get totalMemory(): string {
    return this._totalMemory;
}

public get hotelName(): string {
    return this._hotelName;
}




}
