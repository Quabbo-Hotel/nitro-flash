export function GetProfilePicUrl(username: string): string {
    if(!username) return '';
    return `https://assets.hobbu.net/pics/profilepics/${ username }_profilepic.png`;
}


export function GetBannerUrl(username: string): string {
    if(!username) return '';
    return `https://assets.hobbu.net/pics/banners/${ username }_banner.png`;
}
