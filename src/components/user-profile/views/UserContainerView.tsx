import { FriendlyTime, RequestFriendComposer, UserProfileParser } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { GetSessionDataManager, LocalizeText, SendMessageComposer } from '../../../api';
import { Column, Flex, LayoutAvatarImageView, Text } from '../../../common';

interface UserContainerViewProps
{
    userProfile: UserProfileParser;
}

export const UserContainerView: FC<UserContainerViewProps> = props =>
{
    const { userProfile = null } = props;
    const [requestSent, setRequestSent] = useState(userProfile.requestSent);
    const isOwnProfile = (userProfile.id === GetSessionDataManager().userId);
    const canSendFriendRequest = !requestSent && (!isOwnProfile && !userProfile.isMyFriend && !userProfile.requestSent);

    const addFriend = () =>
    {
        setRequestSent(true);

        SendMessageComposer(new RequestFriendComposer(userProfile.username));
    }

    useEffect(() =>
    {
        setRequestSent(userProfile.requestSent);
    }, [userProfile])
    const formatPlayTime = (timePlayed: number | string | undefined) =>
    {


        const secs = Number(timePlayed) || 0;


        const hours = Math.floor(secs / 3600);


        const minutes = Math.floor((secs % 3600) / 60);





        if (hours > 0) return `${hours}h ${minutes}m`;


        return `${minutes}m`;


    }





    const getTimePlayedSeconds = () =>
    {


        // Prefer the parser getter, fall back to legacy property names.


        const anyProfile = (userProfile as any) || {};





        if (typeof userProfile.timePlayedSeconds === 'number') return Number(userProfile.timePlayedSeconds || 0);





        return Number(anyProfile.timePlayed ?? anyProfile.playTime ?? anyProfile.play_time ?? anyProfile.timePlayedSeconds ?? anyProfile.playTimeSeconds ?? 0);


    }
    return (
        <Flex gap={2}>
            <Column center className="avatar-container">
                <LayoutAvatarImageView figure={userProfile.figure} direction={2} />
            </Column>
            <Column>
                <Column gap={0}>
                    <Text bold small>{userProfile.username}</Text>
                    <Text italics textBreak small>{userProfile.motto}&nbsp;</Text>
                </Column>
                <Column gap={1}>
                    <Text small>
                        <b>{LocalizeText('extendedprofile.created')}</b> {userProfile.registration}
                    </Text>
                    <Text small>
                        <b>{LocalizeText('extendedprofile.last.login')}</b> {FriendlyTime.format(userProfile.secondsSinceLastVisit, '.ago', 2)}
                    </Text>
                    <Text small>
                        <b>{LocalizeText('extendedprofile.achievementscore')}</b> {userProfile.achievementPoints}
                    </Text>
                    <Text small>
                        <b>{LocalizeText('Tiempo jugado')}</b> {formatPlayTime(getTimePlayedSeconds())}
                    </Text>
                </Column>
                <Flex gap={1}>
                    {userProfile.isOnline &&
                        <i className="icon icon-pf-online" />}
                    {!userProfile.isOnline &&
                        <i className="icon icon-pf-offline" />}
                    <Flex alignItems="center" gap={1}>
                        {canSendFriendRequest &&
                            <Text small underline pointer onClick={addFriend}>{LocalizeText('extendedprofile.addasafriend')}</Text>}
                        {!canSendFriendRequest &&
                            <>
                                <i className="icon icon-pf-tick" />
                                {isOwnProfile &&
                                    <Text bold small>{LocalizeText('extendedprofile.me')}</Text>}
                                {userProfile.isMyFriend &&
                                    <Text>{LocalizeText('extendedprofile.friend')}</Text>}
                                {(requestSent || userProfile.requestSent) &&
                                    <Text>{LocalizeText('extendedprofile.friendrequestsent')}</Text>}
                            </>}
                    </Flex>
                </Flex>
            </Column>
        </Flex>
    )
}

interface UserContainerViewProps
{
    userProfile: UserProfileParser;
}

//This would be usefull to upload banners and profile pictures later

/*
export const UserContainerView: FC<UserContainerViewProps> = props =>
{
    const { userProfile = null } = props;
    const [ requestSent, setRequestSent ] = useState(userProfile.requestSent);
    const isOwnProfile = (userProfile.id === GetSessionDataManager().userId);
    const canSendFriendRequest = !requestSent && (!isOwnProfile && !userProfile.isMyFriend && !userProfile.requestSent);

    const addFriend = () =>
    {
        setRequestSent(true);

        SendMessageComposer(new RequestFriendComposer(userProfile.username));
    }

    useEffect(() =>
    {
        setRequestSent(userProfile.requestSent);
    }, [ userProfile ])

    const formatPlayTime = (timePlayed: number | string | undefined) => {
        const secs = Number(timePlayed) || 0;
        const hours = Math.floor(secs / 3600);
        const minutes = Math.floor((secs % 3600) / 60);

        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    }

    const getTimePlayedSeconds = () => {
        // Prefer the parser getter, fall back to legacy property names.
        const anyProfile = (userProfile as any) || {};

        if(typeof userProfile.timePlayedSeconds === 'number') return Number(userProfile.timePlayedSeconds || 0);

        return Number(anyProfile.timePlayed ?? anyProfile.playTime ?? anyProfile.play_time ?? anyProfile.timePlayedSeconds ?? anyProfile.playTimeSeconds ?? 0);
    }

    return (
        <Flex gap={ 2 } style={ { width: '100%' } }>
            <div className="profile-banner" style={ { width: '100%', height: 120, backgroundImage: `url(${ GetBannerUrl(userProfile.username) })`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: 6 } } />
            { isOwnProfile &&
                <div style={ { position: 'absolute', marginTop: 8, right: 16 } }>
                    <input id="bannerFile" type="file" accept="image/*" style={ { display: 'inline-block' } } />
                    <button onClick={ async () => {
                        const input = document.getElementById('bannerFile') as HTMLInputElement;
                        if(!input || !input.files || input.files.length === 0) return;

                        const file = input.files[0];
                        const fd = new FormData();
                        fd.append('file', file);
                        // include session id for auth; session manager provides properties
                        const sid = (GetSessionDataManager() as any).sid || (GetSessionDataManager() as any).sessionId || '';
                        if(sid) fd.append('sid', sid);
                        fd.append('username', userProfile.username);

                        try {
                            const uploadHost = GetConfiguration<string>('comet.http.uploadHost', 'http://localhost:8080');
                            // Ensure username is sent as a multipart part (as some servers ignore plain form fields)
                            fd.append('username', new Blob([userProfile.username], { type: 'text/plain' }), 'username');
                            const url = `${ uploadHost }/upload/banner?username=${ encodeURIComponent(userProfile.username) }`;
                            const res = await fetch(url, { method: 'POST', body: fd, credentials: 'include' });
                            const data = await res.json().catch(() => ({ ok: false, error: 'Invalid JSON response' }));
                            if(!res.ok || !data.ok) {
                                console.error('Upload banner error', res.status, data);
                                alert('Error subiendo banner: ' + (data.error || res.statusText));
                                return;
                            }

                            // on success reload image by forcing cache-bust
                            const imgUrl = GetBannerUrl(userProfile.username) + '?t=' + Date.now();
                            (document.querySelector('.profile-banner') as HTMLElement).style.backgroundImage = `url(${ imgUrl })`;
                            alert('Banner subido correctamente');
                        }
                        catch(e) { console.error(e); alert('Error subiendo banner'); }
                    } }>{ LocalizeText('Upload banner') }</button>
                </div>
            }
            <Column center className="avatar-container" >
                <img id="profileImage" src={ GetProfilePicUrl(userProfile.username) } alt="profile" style={ { width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '3px solid white' } } onError={ e => { (e.target as HTMLImageElement).style.display = 'none'; } } />
                { isOwnProfile &&
                    <div style={ { marginTop: 8 } }>
                        <input id="profileFile" type="file" accept="image/*" style={ { display: 'inline-block' } } />
                        <button onClick={ async () => {
                            const input = document.getElementById('profileFile') as HTMLInputElement;
                            if(!input || !input.files || input.files.length === 0) return;

                            const file = input.files[0];
                            const fd = new FormData();
                            fd.append('file', file);
                            const sid = (GetSessionDataManager() as any).sid || (GetSessionDataManager() as any).sessionId || '';
                            if(sid) fd.append('sid', sid);
                            fd.append('username', userProfile.username);

                            try {
                                    const uploadHost = GetConfiguration<string>('comet.http.uploadHost', 'http://localhost:8080');
                                    // Ensure username is sent as a multipart part and also add it as a query param fallback
                                    fd.append('username', new Blob([userProfile.username], { type: 'text/plain' }), 'username');
                                    const url = `${ uploadHost }/upload/profile?username=${ encodeURIComponent(userProfile.username) }`;
                                    const res = await fetch(url, { method: 'POST', body: fd, credentials: 'include' });
                                    const data = await res.json().catch(() => ({ ok: false, error: 'Invalid JSON response' }));
                                    if(!res.ok || !data.ok) {
                                        console.error('Upload profile error', res.status, data);
                                        alert('Error subiendo foto de perfil: ' + (data.error || res.statusText));
                                        return;
                                    }

                                    const img = document.getElementById('profileImage') as HTMLImageElement;
                                    img.src = GetProfilePicUrl(userProfile.username) + '?t=' + Date.now();
                                    alert('Foto de perfil subida correctamente');
                                }
                                catch(e) { console.error(e); alert('Error subiendo foto de perfil'); }
                        } }>{ LocalizeText('Upload profile picture') }</button>
                    </div>
                }
                
            </Column>
            <Column>
                <Column gap={ 0 }>
                    <Text bold>{ userProfile.username }</Text>
                    <Text italics textBreak small>{ userProfile.motto }&nbsp;</Text>
                </Column>
                <Column gap={ 1 }>
                    <Text small>
                        <b>{ LocalizeText('extendedprofile.created') }</b> { userProfile.registration }
                    </Text>
                    <Text small>
                        <b>{ LocalizeText('extendedprofile.last.login') }</b> { FriendlyTime.format(userProfile.secondsSinceLastVisit, '.ago', 2) }
                    </Text>
                    <Text small>
                        <b>{ LocalizeText('extendedprofile.achievementscore') }</b> { userProfile.achievementPoints }
                    </Text>
                    <Text small>
                        <b>{ LocalizeText('Tiempo jugado') }</b> { formatPlayTime(getTimePlayedSeconds()) }
                    </Text>
                </Column>
                <Flex gap={ 1 }>
                    
                    { userProfile.isOnline &&
                        <i className="icon icon-pf-online" /> }
                    { !userProfile.isOnline &&
                        <i className="icon icon-pf-offline" /> }
                    <Flex alignItems="center" gap={ 1 }>
                        { canSendFriendRequest &&
                            <Text small underline pointer onClick={ addFriend }>{ LocalizeText('extendedprofile.addasafriend') }</Text> }
                        { !canSendFriendRequest &&
                            <>
                                <i className="icon icon-pf-tick" />
                                { isOwnProfile &&
                                    <Text>{ LocalizeText('extendedprofile.me') }</Text> }
                                { userProfile.isMyFriend &&
                                    <Text>{ LocalizeText('extendedprofile.friend') }</Text> }
                                { (requestSent || userProfile.requestSent) &&
                                    <Text>{ LocalizeText('extendedprofile.friendrequestsent') }</Text> }
                            </> }
                            <LayoutAvatarImageView figure={ userProfile.figure } direction={ 2 } style={ { display: 'none' } } />
                    </Flex>
                </Flex>
            </Column>
        </Flex>
    )
}*/
