import { ExtendedProfileChangedMessageEvent, RelationshipStatusInfoEvent, RelationshipStatusInfoMessageParser, RoomEngineObjectEvent, RoomObjectCategory, RoomObjectType, UserCurrentBadgesComposer, UserCurrentBadgesEvent, UserProfileEvent, UserProfileParser, UserRelationshipsComposer } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { CreateLinkEvent, GetRoomSession, GetSessionDataManager, GetUserProfile, LocalizeText, SendMessageComposer } from '../../api';
import { Column, Flex, Grid, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../common';
import { useMessageEvent, useRoomEngineEvent } from '../../hooks';
import { BadgesContainerView } from './views/BadgesContainerView';
import { FriendsContainerView } from './views/FriendsContainerView';
import { GroupsContainerView } from './views/GroupsContainerView';
import { UserContainerView } from './views/UserContainerView';

export const UserProfileView: FC<{}> = props =>
{
    const [ userProfile, setUserProfile ] = useState<UserProfileParser>(null);
    const [ userBadges, setUserBadges ] = useState<string[]>([]);
    const [ userRelationships, setUserRelationships ] = useState<RelationshipStatusInfoMessageParser>(null);

    const onClose = () =>
    {
        setUserProfile(null);
        setUserBadges([]);
        setUserRelationships(null);
    }

    const onLeaveGroup = () =>
    {
        if(!userProfile || (userProfile.id !== GetSessionDataManager().userId)) return;

        GetUserProfile(userProfile.id);
    }

    useMessageEvent<UserCurrentBadgesEvent>(UserCurrentBadgesEvent, event =>
    {
        const parser = event.getParser();

        if(!userProfile || (parser.userId !== userProfile.id)) return;

        setUserBadges(parser.badges);
    });

    useMessageEvent<RelationshipStatusInfoEvent>(RelationshipStatusInfoEvent, event =>
    {
        const parser = event.getParser();

        if(!userProfile || (parser.userId !== userProfile.id)) return;

        setUserRelationships(parser);
    });

    useMessageEvent<UserProfileEvent>(UserProfileEvent, event =>
    {
        const parser = event.getParser();

        let isSameProfile = false;

        setUserProfile(prevValue =>
        {
            if(prevValue && prevValue.id) isSameProfile = (prevValue.id === parser.id);

            return parser;
        });

        if(!isSameProfile)
        {
            setUserBadges([]);
            setUserRelationships(null);
        }

        SendMessageComposer(new UserCurrentBadgesComposer(parser.id));
        SendMessageComposer(new UserRelationshipsComposer(parser.id));
    });

    useMessageEvent<ExtendedProfileChangedMessageEvent>(ExtendedProfileChangedMessageEvent, event =>
    {
        const parser = event.getParser();

        if(parser.userId != userProfile?.id) return;

        GetUserProfile(parser.userId);
    });

    useRoomEngineEvent<RoomEngineObjectEvent>(RoomEngineObjectEvent.SELECTED, event =>
    {
        if(!userProfile) return;

        if(event.category !== RoomObjectCategory.UNIT) return;

        const userData = GetRoomSession().userDataManager.getUserDataByIndex(event.objectId);

        if(userData.type !== RoomObjectType.USER) return;

        GetUserProfile(userData.webID);
    });

    if(!userProfile) return null;

    return (
        <NitroCardView uniqueKey="nitro-user-profile" theme="primary" className="user-profile">
            <NitroCardHeaderView headerText={ LocalizeText('extendedprofile.caption') } onCloseClick={ onClose } />
            <NitroCardContentView overflow="hidden">
                <Grid fullHeight={ false } gap={ 2 }>
                    <Column size={ 7 } gap={ 1 } className="user-container pe-2">
                        <UserContainerView userProfile={ userProfile } />
                        { userProfile.id === GetSessionDataManager().userId &&
                        <Flex className="p-0">
                            <Text small underline className="cursor-pointer" onClick={ event => CreateLinkEvent('avatar-editor/toggle') }>Change Clothes</Text>
                            <Text className="cursor-pointer badge-text" small underline onClick={ event => CreateLinkEvent('inventory/toggle') }>Change Badges</Text>
                        </Flex>
                        }
                        <Grid columnCount={ 5 } fullHeight className="profile-grey-bg p-1">
                            <BadgesContainerView fullWidth center badges={ userBadges } />
                        </Grid>
                    </Column>
                    <Column size={ 5 }>
                        { userRelationships &&
                            <FriendsContainerView relationships={ userRelationships } friendsCount={ userProfile.friendsCount } /> }
                    </Column>
                </Grid>
                <Flex alignItems="center" className="rooms-button-container px-2 py-1">
                    <Flex alignItems="center" gap={ 1 } onClick={ event => CreateLinkEvent(`navigator/search/hotel_view/owner:${ userProfile.username }`) }>
                        <i className="icon icon-rooms" />
                        <Text bold small underline pointer>{ LocalizeText('extendedprofile.rooms') }</Text>
                    </Flex>
                </Flex>
                <GroupsContainerView fullWidth itsMe={ userProfile.id === GetSessionDataManager().userId } groups={ userProfile.groups } onLeaveGroup={ onLeaveGroup } />
            </NitroCardContentView>
        </NitroCardView>
    )
}
//This could be usefull to upload banners and profile pictures later
/*

import { ExtendedProfileChangedMessageEvent, RelationshipStatusEnum, RelationshipStatusInfoEvent, RelationshipStatusInfoMessageParser, RoomEngineObjectEvent, RoomObjectCategory, RoomObjectType, UserCurrentBadgesComposer, UserCurrentBadgesEvent, UserProfileEvent, UserProfileParser, UserRelationshipsComposer } from '@nitrots/nitro-renderer';
import { FC, useRef, useState } from 'react';
import { GetConfiguration, GetRoomSession, GetSessionDataManager, GetUserProfile, LocalizeText, SendMessageComposer } from '../../api';
import { GetBannerUrl, GetProfilePicUrl } from '../../api/assets';
import { LayoutAvatarImageView, LayoutBadgeImageView, NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../common';
import { useMessageEvent, useRoomEngineEvent } from '../../hooks';

export const UserProfileView: FC<{}> = props => {
    const [userProfile, setUserProfile] = useState<UserProfileParser>(null);
    const [userBadges, setUserBadges] = useState<string[]>([]);
    const [userRelationships, setUserRelationships] = useState<RelationshipStatusInfoMessageParser>(null);

    // Image editor state (shared for banner and profile image)
    const [editorOpen, setEditorOpen] = useState(false);
    const [editorType, setEditorType] = useState<'banner' | 'profile' | null>(null);
    const [editorImage, setEditorImage] = useState<string | null>(null);
    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const startPointer = useRef<{ x: number, y: number } | null>(null);
    const startOffset = useRef<{ x: number, y: number } | null>(null);
    const imgNatural = useRef<{ w: number, h: number }>({ w: 0, h: 0 });
    const containerRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const pendingEditorType = useRef<'banner' | 'profile' | null>(null);

    const onClose = () => {
        setUserProfile(null);
        setUserBadges([]);
        setUserRelationships(null);
    }

    const onLeaveGroup = () => {
        if (!userProfile || (userProfile.id !== GetSessionDataManager().userId)) return;

        GetUserProfile(userProfile.id);
    }

    useMessageEvent<UserCurrentBadgesEvent>(UserCurrentBadgesEvent, event => {
        const parser = event.getParser();

        if (!userProfile || (parser.userId !== userProfile.id)) return;

        setUserBadges(parser.badges);
    });

    useMessageEvent<RelationshipStatusInfoEvent>(RelationshipStatusInfoEvent, event => {
        const parser = event.getParser();

        if (!userProfile || (parser.userId !== userProfile.id)) return;

        setUserRelationships(parser);
    });

    useMessageEvent<UserProfileEvent>(UserProfileEvent, event => {
        const parser = event.getParser();

        let isSameProfile = false;

        setUserProfile(prevValue => {
            if (prevValue && prevValue.id) isSameProfile = (prevValue.id === parser.id);

            return parser;
        });

        if (!isSameProfile) {
            setUserBadges([]);
            setUserRelationships(null);
        }

        SendMessageComposer(new UserCurrentBadgesComposer(parser.id));
        SendMessageComposer(new UserRelationshipsComposer(parser.id));
    });

    useMessageEvent<ExtendedProfileChangedMessageEvent>(ExtendedProfileChangedMessageEvent, event => {
        const parser = event.getParser();

        if (parser.userId != userProfile?.id) return;

        GetUserProfile(parser.userId);
    });

    useRoomEngineEvent<RoomEngineObjectEvent>(RoomEngineObjectEvent.SELECTED, event => {
        if (!userProfile) return;

        if (event.category !== RoomObjectCategory.UNIT) return;

        const userData = GetRoomSession().userDataManager.getUserDataByIndex(event.objectId);

        if (userData.type !== RoomObjectType.USER) return;

        GetUserProfile(userData.webID);
    });
    const getTimePlayedSeconds = () => {
        // Prefer the parser getter, fall back to legacy property names.
        const anyProfile = (userProfile as any) || {};

        if (typeof userProfile.timePlayedSeconds === 'number') return Number(userProfile.timePlayedSeconds || 0);

        return Number(anyProfile.timePlayed ?? anyProfile.playTime ?? anyProfile.play_time ?? anyProfile.timePlayedSeconds ?? anyProfile.playTimeSeconds ?? 0);
    }

    const formatPlayTime = (timePlayed: number | string | undefined) => {
        const secs = Number(timePlayed) || 0;
        const hours = Math.floor(secs / 3600);
        const minutes = Math.floor((secs % 3600) / 60);

        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    }

    if (!userProfile) return null;


    const isOwnProfile = (userProfile.id === GetSessionDataManager().userId);

    return (
        <NitroCardView uniqueKey="nitro-user-profile" theme="primary-slim" className="user-profile">
            <NitroCardHeaderView headerText={LocalizeText('extendedprofile.caption')} onCloseClick={onClose} />
            <NitroCardContentView >
                <div className="wrap-profile" role="main">
                    <div className="header-profile">
                        <img id='' src={GetBannerUrl(userProfile.username)} alt={userProfile.username} />
                    </div>

                    <div className="circle-profile-container" aria-hidden="true">
                        <div className="circle-profile">
                            <img id='profileImage' src={GetProfilePicUrl(userProfile.username)} alt={userProfile.username} />
                        </div>
                        {userProfile.isOnline &&
                            <i className="icon-online" />}
                        {!userProfile.isOnline &&
                            <i className="icon-offline" />}


                    </div>




                    <div className="middle-row-profile">
                        <div className="col-profile-1">
                            <div className='profile-holder'>
                                <div className='name-placeholder'>
                                    <div className='usernamehold'>
                                        {userProfile.username}
                                    </div>
                                    <div className='usernamehold2'>
                                        {userProfile.username}
                                    </div>
                                </div>
                                <div className='holder-image'>
                                    <LayoutAvatarImageView figure={userProfile.figure} direction={2} style={{ zIndex: 100, width: '100%', height: '100%', bottom: "2px" }} />
                                </div>

                            </div>
                            <div className='separator-container'>
                                <div className='separator'>

                                </div>
                            </div>

                            <div className='profile-holder'>

                                <div className='data-placeholder-container'>

                                    <div className='flex-icon-data'>
                                        <div className='arrows icon-arrows'>

                                        </div>
                                        <div className='border-data-icon'>
                                            <div className='middle-holder icon-thumbsup'>

                                            </div>
                                            <div className='data-placeholder'>thumbsup</div>
                                        </div>
                                    </div>
                                    <div className='flex-icon-data'>
                                        <div className='arrows icon-arrows'>

                                        </div>
                                        <div className='border-data-icon'>
                                            <div className='middle-holder icon-star'>

                                            </div>
                                            <div className='data-placeholder'>{userProfile.achievementPoints}</div>
                                        </div>
                                    </div>

                                    <div className='flex-icon-data'>
                                        <div className='arrows icon-arrows'>

                                        </div><div className='border-data-icon'>
                                            <div className='middle-holder icon-timeplayed'></div>
                                            <div className='data-placeholder'>{formatPlayTime(getTimePlayedSeconds())}</div>
                                        </div>
                                    </div>
                                    <div className='flex-icon-data'>
                                        <div className='arrows icon-arrows'>

                                        </div>
                                        <div className='border-data-icon'>
                                            <div className='middle-holder icon-register'>

                                            </div>
                                            <div className='data-placeholder'>{userProfile.registration}</div>
                                        </div>
                                    </div>


                                </div>

                            </div>

                        </div>

                        <div className="col-profile-3">
                            <div>
                                {isOwnProfile &&
                                    <div>
                                        <input ref={fileInputRef} id="userProfileFile" type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                                            const input = e.target as HTMLInputElement;
                                            if (!input || !input.files || input.files.length === 0) return;
                                            const file = input.files[0];
                                            const reader = new FileReader();
                                            reader.onload = () => {
                                                setEditorImage(String(reader.result));
                                                setEditorType(pendingEditorType.current);
                                                setEditorOpen(true);
                                                setScale(1);
                                                setOffset({ x: 0, y: 0 });
                                                pendingEditorType.current = null;
                                            };
                                            reader.readAsDataURL(file);
                                            // reset value so same file can be picked again if needed
                                            input.value = '';
                                        }} />

                                        <div className='container-buttons'>
                                            <button className="button-banner" onClick={() => {
                                                if (!fileInputRef.current) return;
                                                pendingEditorType.current = 'banner';
                                                fileInputRef.current.click();
                                            }}>

                                            </button>
                                            <button className="button-profile" onClick={() => {
                                                if (!fileInputRef.current) return;
                                                pendingEditorType.current = 'profile';
                                                fileInputRef.current.click();
                                            }}>

                                            </button>
                                        </div>
                                    </div>
                                }
                            </div>
                            {userProfile.isVip ? <div className='flag-img'></div> : <div className='flag-img2'></div>}
                        </div>
                    </div>

                    <div className="bottom-profile">
                        <div className='flex-center'>
                            <div className='separator2'></div>
                        </div>
                        <div className='flex-center text-color-dark'>
                            <div className='container-friends-relations flex-center'>
                                <div className='container-user-name'>
                                    <div className='relation-container-keko'>
                                        {userRelationships && userRelationships.relationshipStatusMap && userRelationships.relationshipStatusMap.getValue(RelationshipStatusEnum.HEART) && userRelationships.relationshipStatusMap.getValue(RelationshipStatusEnum.HEART).randomFriendFigure
                                            ? <>
                                                <img className='keko-relation' src={`https://imager.hobbu.net/?figure=${userRelationships.relationshipStatusMap.getValue(RelationshipStatusEnum.HEART).randomFriendFigure}`} alt={userRelationships.relationshipStatusMap.getValue(RelationshipStatusEnum.HEART).randomFriendName || 'friend'} />
                                                
                                            </>
                                            : <img className='keko-relation' src="https://imager.hobbu.net/?figure" alt="friend1" />}
                                    </div>
                                    <div className='relation-container-text  flex-center'>
                                        <div className='container-text-icon  flex-center'>
                                            <div className='icon-arrows'>

                                            </div>
                                            <div className='icon-heart'>

                                            </div>
                                            <div>
                                                {(userRelationships && userRelationships.relationshipStatusMap && userRelationships.relationshipStatusMap.getValue(RelationshipStatusEnum.HEART) && userRelationships.relationshipStatusMap.getValue(RelationshipStatusEnum.HEART).randomFriendName)
                                                    ? <u style={{ cursor: 'pointer' }} onClick={() => { const r = userRelationships.relationshipStatusMap.getValue(RelationshipStatusEnum.HEART); if (r && (r.randomFriendId >= 1)) GetUserProfile(r.randomFriendId); }}>{userRelationships.relationshipStatusMap.getValue(RelationshipStatusEnum.HEART).randomFriendName}</u>
                                                    : 'Leeme'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='container-user-name'>
                                    <div className='relation-container-keko'>
                                        {userRelationships && userRelationships.relationshipStatusMap && userRelationships.relationshipStatusMap.getValue(RelationshipStatusEnum.SMILE) && userRelationships.relationshipStatusMap.getValue(RelationshipStatusEnum.SMILE).randomFriendFigure
                                            ? <>
                                                <img className='keko-relation' src={`https://imager.hobbu.net/?figure=${userRelationships.relationshipStatusMap.getValue(RelationshipStatusEnum.SMILE).randomFriendFigure}`} alt={userRelationships.relationshipStatusMap.getValue(RelationshipStatusEnum.SMILE).randomFriendName || 'friend'} />
                                                
                                            </>
                                            : <img className='keko-relation' src="https://imager.hobbu.net/?figure" alt="friend1" />}
                                    </div>
                                    <div className='relation-container-text  flex-center'>
                                        <div className='container-text-icon  flex-center'>
                                            <div className='icon-arrows'>

                                            </div>
                                            <div className='icon-smile'>

                                            </div>
                                            <div>
                                                {(userRelationships && userRelationships.relationshipStatusMap && userRelationships.relationshipStatusMap.getValue(RelationshipStatusEnum.SMILE) && userRelationships.relationshipStatusMap.getValue(RelationshipStatusEnum.SMILE).randomFriendName)
                                                    ? <u style={{ cursor: 'pointer' }} onClick={() => { const r = userRelationships.relationshipStatusMap.getValue(RelationshipStatusEnum.SMILE); if (r && (r.randomFriendId >= 1)) GetUserProfile(r.randomFriendId); }}>{userRelationships.relationshipStatusMap.getValue(RelationshipStatusEnum.SMILE).randomFriendName}</u>
                                                    : 'Leeme'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='container-user-name'>
                                    <div className='relation-container-keko'>
                                        {userRelationships && userRelationships.relationshipStatusMap && userRelationships.relationshipStatusMap.getValue(RelationshipStatusEnum.BOBBA) && userRelationships.relationshipStatusMap.getValue(RelationshipStatusEnum.BOBBA).randomFriendFigure
                                            ? <>
                                                <img className='keko-relation' src={`https://imager.hobbu.net/?figure=${userRelationships.relationshipStatusMap.getValue(RelationshipStatusEnum.BOBBA).randomFriendFigure}`} alt={userRelationships.relationshipStatusMap.getValue(RelationshipStatusEnum.BOBBA).randomFriendName || 'friend'} />
                                                
                                            </>
                                            : <img className='keko-relation' src="https://imager.hobbu.net/?figure" alt="friend1" />}
                                    </div>
                                    <div className='relation-container-text  flex-center'>
                                        <div className='container-text-icon  flex-center'>
                                            <div className='icon-arrows'>

                                            </div>
                                            <div className='icon-hate'>

                                            </div>
                                            <div>
                                                {(userRelationships && userRelationships.relationshipStatusMap && userRelationships.relationshipStatusMap.getValue(RelationshipStatusEnum.BOBBA) && userRelationships.relationshipStatusMap.getValue(RelationshipStatusEnum.BOBBA).randomFriendName)
                                                    ? <u style={{ cursor: 'pointer' }} onClick={() => { const r = userRelationships.relationshipStatusMap.getValue(RelationshipStatusEnum.BOBBA); if (r && (r.randomFriendId >= 1)) GetUserProfile(r.randomFriendId); }}>{userRelationships.relationshipStatusMap.getValue(RelationshipStatusEnum.BOBBA).randomFriendName}</u>
                                                    : 'Leeme'}
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div>

                        </div>
                        <div className='flex-center'>
                            <div className='separator2'>

                            </div>
                        </div>
                        <div className='badge-groups-container'>
                            <div className='badges-container'>
                                <div className='badge-containers-row'>
                                    {[0, 1, 2, 3].map(i => (
                                        <div key={i} className='badge-container'>
                                            {userBadges && userBadges[i] ? <LayoutBadgeImageView badgeCode={userBadges[i]} /> : null}
                                        </div>
                                    ))}
                                </div>
                                <div className='badge-containers-row'>
                                    {[4, 5, 6, 7].map(i => (
                                        <div key={i} className='badge-container'>
                                            {userBadges && userBadges[i] ? <LayoutBadgeImageView badgeCode={userBadges[i]} /> : null}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='flex-center'>
                                <div className='separator'>

                                </div>

                            </div>
                            <div className='flex-center'>Grupos pronto</div>


                        </div>
                    </div>
                </div>
            </NitroCardContentView>

                {editorOpen && editorImage && (
                    <div className="image-editor-modal" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                        <div ref={containerRef} className="image-editor-container" style={{ width: editorType === 'banner' ? 900 : 300, height: editorType === 'banner' ? 250 : 300, background: '#222', position: 'relative', overflow: 'hidden', borderRadius: 8 }}
                            onPointerDown={(e) => {
                                try { (e.target as Element).setPointerCapture((e as any).pointerId); } catch { }
                                setIsDragging(true);
                                startPointer.current = { x: (e as any).clientX, y: (e as any).clientY };
                                startOffset.current = { ...offset };
                            }}
                            onPointerUp={(e) => {
                                try { (e.target as Element).releasePointerCapture((e as any).pointerId); } catch { }
                                setIsDragging(false);
                                startPointer.current = null;
                                startOffset.current = null;
                            }}
                            onPointerMove={(e) => {
                                if (!isDragging || !startPointer.current || !startOffset.current) return;
                                const dx = (e as any).clientX - startPointer.current.x;
                                const dy = (e as any).clientY - startPointer.current.y;
                                setOffset({ x: startOffset.current.x + dx, y: startOffset.current.y + dy });
                            }}
                        >
                            <img src={editorImage} alt="editor" onLoad={(e) => {
                                const img = e.currentTarget as HTMLImageElement;
                                imgNatural.current = { w: img.naturalWidth, h: img.naturalHeight };
                            }} style={{ position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${scale})`, transformOrigin: 'center center', userSelect: 'none', pointerEvents: 'none' }} />

                            <div style={{ position: 'absolute', left: 8, bottom: 8, right: 8, display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'space-between' }}>
                                <input type="range" min="0.5" max="3" step="0.01" value={scale} onChange={(e) => setScale(Number((e.target as HTMLInputElement).value))} style={{ flex: 1 }} />
                                <div style={{ display: 'flex', gap: 8, marginLeft: 8 }}>
                                    <button onClick={() => { setEditorOpen(false); setEditorImage(null); setEditorType(null); setScale(1); setOffset({ x: 0, y: 0 }); }}>Cancel</button>
                                    <button className='button-banner' onClick={async () => {
                                        // crop to container size and upload
                                        const container = containerRef.current;
                                        if (!container) return;
                                        const rect = container.getBoundingClientRect();
                                        const canvas = document.createElement('canvas');
                                        canvas.width = Math.round(rect.width);
                                        canvas.height = Math.round(rect.height);
                                        const ctx = canvas.getContext('2d');
                                        if (!ctx) return;

                                        // draw the transformed image
                                        const img = new Image();
                                        img.crossOrigin = 'anonymous';
                                        img.src = editorImage!;
                                        await new Promise<void>((resolve, reject) => { img.onload = () => resolve(); img.onerror = () => reject(); });

                                        // Compute draw parameters: center the scaled image and apply offsets
                                        const scaleFactor = scale;
                                        const drawW = img.naturalWidth * scaleFactor;
                                        const drawH = img.naturalHeight * scaleFactor;

                                        // image is centered at container center then shifted by offset
                                        const cx = canvas.width / 2 + offset.x;
                                        const cy = canvas.height / 2 + offset.y;

                                        const dx = cx - drawW / 2;
                                        const dy = cy - drawH / 2;

                                        ctx.fillStyle = '#000';
                                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                                        ctx.drawImage(img, dx, dy, drawW, drawH);

                                        // convert to blob and upload
                                        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'));
                                        if (!blob) { alert('Failed to create image'); return; }

                                        const fd = new FormData();
                                        fd.append('file', blob, `${editorType}_${userProfile.username}.png`);
                                        const sid = (GetSessionDataManager() as any).sid || (GetSessionDataManager() as any).sessionId || '';
                                        if (sid) fd.append('sid', sid);
                                        fd.append('username', userProfile.username);

                                        try {
                                            const uploadHost = GetConfiguration<string>('comet.http.uploadHost', 'http://localhost:8080');
                                            const url = `${uploadHost}/upload/${editorType}?username=${encodeURIComponent(userProfile.username)}`;
                                            const res = await fetch(url, { method: 'POST', body: fd, credentials: 'include' });
                                            const data = await res.json().catch(() => ({ ok: false, error: 'Invalid JSON response' }));
                                            if (!res.ok || !data.ok) {
                                                console.error('Upload error', res.status, data);
                                                alert('Error uploading image: ' + (data.error || res.statusText));
                                                return;
                                            }

                                            const imgUrl = (editorType === 'banner' ? GetBannerUrl(userProfile.username) : GetProfilePicUrl(userProfile.username)) + '?t=' + Date.now();
                                            const bannerElem = document.querySelector('.profile-banner') as HTMLElement | null;
                                            if (bannerElem && editorType === 'banner') bannerElem.style.backgroundImage = `url(${imgUrl})`;
                                            const imgElem = document.querySelector('.header-profile img') as HTMLImageElement | null;
                                            if (imgElem && editorType === 'banner') imgElem.src = imgUrl;
                                            const profileImgElem = document.getElementById('profileImage') as HTMLImageElement | null;
                                            if (profileImgElem && editorType === 'profile') profileImgElem.src = imgUrl;

                                            alert('Imagen subida correctamente');
                                            setEditorOpen(false);
                                            setEditorImage(null);
                                            setEditorType(null);
                                        }
                                        catch (e) { console.error(e); alert('Error subiendo imagen'); }
                                    }}>Upload</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

        </NitroCardView>
    )
}

*/
