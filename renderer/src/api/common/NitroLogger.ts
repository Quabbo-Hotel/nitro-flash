export class NitroLogger
{
    public static LOG_DEBUG: boolean = false;
    public static LOG_WARN: boolean = false;
    public static LOG_ERROR: boolean = false;
    public static LOG_EVENTS: boolean = false;
    public static LOG_PACKETS: boolean = false;

    public static log(...messages: any[]): void
    {
        if(!this.LOG_DEBUG) return;

        console.log(this.logPrefix(), ...messages);
    }

    public static warn(...messages: any[]): void
    {
        if(!this.LOG_WARN) return;

        console.warn(this.logPrefix(), ...messages);
    }

    public static error(...messages: any[]): void
    {
        if(!this.LOG_ERROR) return;

        console.error(this.logPrefix(), ...messages);
    }

    public static events(...messages: any[]): void
    {
        if(!this.LOG_EVENTS) return;

        console.log(this.logPrefix(), ...messages);
    }

    public static packets(...messages: any[]): void
    {
        if(!this.LOG_PACKETS) return;

        console.log(this.logPrefix(), ...messages);
    }

    private static logPrefix(): string
    {
        return '[Nitro]';
    }

    // Auto-clear management
    private static _autoClearHandle: any = null;

    public static startAutoClear(intervalMs: number = 60000): void
    {
        try
        {
            if(this._autoClearHandle) this.stopAutoClear();

            this._autoClearHandle = (globalThis as any).setInterval(() => {
                try { console.clear(); } catch(e) { /* ignore */ }
            }, intervalMs);
        }
        catch(e)
        {
            // ignore if environment doesn't support globalThis.setInterval
        }
    }

    public static stopAutoClear(): void
    {
        try
        {
            if(!this._autoClearHandle) return;

            (globalThis as any).clearInterval(this._autoClearHandle);
            this._autoClearHandle = null;
        }
        catch(e)
        {
            // ignore
        }
    }
}
 
// limpiar logs cada 60s para ver si da lag esto spoiler no
//NitroLogger.startAutoClear(60000);
