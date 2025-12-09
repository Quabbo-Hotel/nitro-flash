export const GetLocalStorage = <T>(key: string) =>
{
    try
    {
        const item = window.localStorage.getItem(key);

        if(item === null) return null;

        return JSON.parse(item) as T;
    }
    catch(e)
    {
        return null;
    }
}
