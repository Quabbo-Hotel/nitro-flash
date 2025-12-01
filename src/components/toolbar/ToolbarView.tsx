import { Dispose, DropBounce, EaseOut, JumpBy, Motions, NitroToolbarAnimateIconEvent, PerkAllowancesMessageEvent, PerkEnum, Queue, RoomControllerLevel, RoomEngineEvent, RoomEngineObjectEvent, RoomObjectCategory, RoomRightsClearEvent, RoomRightsEvent, RoomRightsOwnerEvent, Wait, PlayerWalkKeysEvent, PlayerVimKeysEvent } from '@nitrots/nitro-renderer';
import { KeyboardInputMessageComposer } from '@nitrots/nitro-renderer/src/nitro/communication/messages/outgoing/room/engine/KeyboardInputMessageComposer';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { CreateLinkEvent, GetConfiguration, GetRoomEngine, GetSessionDataManager, MessengerIconState, OpenMessengerChat, SendMessageComposer, VisitDesktop } from '../../api';
import { Base, Flex, LayoutAvatarImageView, LayoutItemCountView, TransitionAnimation, TransitionAnimationTypes } from '../../common';
import { useAchievements, useFriends, useInventoryUnseenTracker, useMessageEvent, useMessenger, useRoom, useRoomEngineEvent, useSessionInfo } from '../../hooks';
import { ToolbarMeView } from './ToolbarMeView';

const KEYBOARD_TRIGGER_TYPES = new Set<string>(['wf_trg_mobi_ssortants']);

const isKeyboardTriggerType = (type?: string) =>
{
    if(!type) return false;

    return KEYBOARD_TRIGGER_TYPES.has(type.toLowerCase());
};

export const ToolbarView: FC<{ isInRoom: boolean }> = props => 
{
    const { isInRoom } = props;
    const [isMeExpanded, setMeExpanded] = useState(false);
    const [useGuideTool, setUseGuideTool] = useState(false);
    const [canUseWiredMonitor, setCanUseWiredMonitor] = useState(false);
    const [canSendKeyboardInput, setCanSendKeyboardInput] = useState(false);
    const keyboardTriggerIdsRef = useRef<Set<number>>(new Set());

    const { userFigure = null } = useSessionInfo();
    const { getFullCount = 0 } = useInventoryUnseenTracker();
    const { getTotalUnseen = 0 } = useAchievements();
    const { requests = [] } = useFriends();
    const { iconState = MessengerIconState.HIDDEN } = useMessenger();
    const { roomSession = null } = useRoom();
    const isMod = GetSessionDataManager().isModerator;

    const refreshKeyboardTriggerState = useCallback(() =>
    {
        if(!roomSession)
        {
            keyboardTriggerIdsRef.current.clear();
            setCanSendKeyboardInput(false);
            return;
        }

        const roomEngine = GetRoomEngine();

        if(!roomEngine)
        {
            keyboardTriggerIdsRef.current.clear();
            setCanSendKeyboardInput(false);
            return;
        }

        const roomId = roomSession.roomId;
        const totalObjects = roomEngine.getRoomObjectCount(roomId, RoomObjectCategory.FLOOR) || 0;
        const trackedIds = new Set<number>();

        for(let index = 0; index < totalObjects; index++)
        {
            const roomObject = roomEngine.getRoomObjectByIndex(roomId, index, RoomObjectCategory.FLOOR);

            if(roomObject && isKeyboardTriggerType(roomObject.type))
            {
                trackedIds.add(roomObject.id);
            }
        }

        keyboardTriggerIdsRef.current = trackedIds;
        const enabledFromWindow = ((window as any).walkKeysEnabled || (window as any).vimKeysEnabled);
        setCanSendKeyboardInput(trackedIds.size > 0 || enabledFromWindow);
    }, [ roomSession ]);

    useEffect(() =>
    {
        if(!roomSession)
        {
            keyboardTriggerIdsRef.current.clear();
            setCanSendKeyboardInput(false);
            return;
        }

        refreshKeyboardTriggerState();
    }, [ roomSession, refreshKeyboardTriggerState ]);

    // Permiso para usar la guía
    useMessageEvent<PerkAllowancesMessageEvent>(PerkAllowancesMessageEvent, event => 
    {
        const parser = event.getParser();
        setUseGuideTool(parser.isAllowed(PerkEnum.USE_GUIDE_TOOL));
    });

    // Animación ícono al toolbar
    useRoomEngineEvent<NitroToolbarAnimateIconEvent>(NitroToolbarAnimateIconEvent.ANIMATE_ICON, event => 
    {
        const animationIconToToolbar = (iconName: string, image: HTMLImageElement, x: number, y: number) =>
        {
            const target = (document.body.getElementsByClassName(iconName)[0] as HTMLElement);
            if(!target) return;

            image.className = 'toolbar-icon-animation';
            image.style.visibility = 'visible';
            image.style.left = (x + 'px');
            image.style.top = (y + 'px');
            document.body.append(image);

            const targetBounds = target.getBoundingClientRect();
            const imageBounds = image.getBoundingClientRect();
            const left = (imageBounds.x - targetBounds.x);
            const top = (imageBounds.y - targetBounds.y);
            const squared = Math.sqrt(((left * left) + (top * top)));
            const wait = (500 - Math.abs(((((1 / squared) * 100) * 500) * 0.5)));
            const height = 20;
            const motionName = `ToolbarBouncing_${iconName}`;

            if(!Motions.getMotionByTag(motionName))
            {
                Motions.runMotion(new Queue(new Wait((wait + 8)), new DropBounce(target, 400, 12))).tag = motionName;
            }

            const motion = new Queue(
                new EaseOut(new JumpBy(image, wait, ((targetBounds.x - imageBounds.x) + height), (targetBounds.y - imageBounds.y), 100, 1), 1),
                new Dispose(image)
            );
            Motions.runMotion(motion);
        };
        animationIconToToolbar('icon-inventory', event.image, event.x, event.y);
    });

    useRoomEngineEvent<RoomEngineEvent>(RoomEngineEvent.INITIALIZED, event =>
    {
        if(!roomSession || (event.roomId !== roomSession.roomId)) return;

        refreshKeyboardTriggerState();
    });

    useRoomEngineEvent<RoomEngineEvent>(RoomEngineEvent.DISPOSED, event =>
    {
        if(!roomSession || (event.roomId !== roomSession.roomId)) return;

        keyboardTriggerIdsRef.current.clear();
        setCanSendKeyboardInput(false);
    });

    useRoomEngineEvent<RoomEngineObjectEvent>([ RoomEngineObjectEvent.ADDED, RoomEngineObjectEvent.REMOVED ], event =>
    {
        if(!roomSession || (event.roomId !== roomSession.roomId) || (event.category !== RoomObjectCategory.FLOOR)) return;

        if(event.type === RoomEngineObjectEvent.ADDED)
        {
            const roomEngine = GetRoomEngine();

            if(!roomEngine) return;

            const object = roomEngine.getRoomObject(event.roomId, event.objectId, event.category);

            if(object && isKeyboardTriggerType(object.type))
            {
                keyboardTriggerIdsRef.current.add(event.objectId);
                setCanSendKeyboardInput(true);
            }

            return;
        }

        if(event.type === RoomEngineObjectEvent.REMOVED)
        {
            if(!keyboardTriggerIdsRef.current.size) return;

            keyboardTriggerIdsRef.current.delete(event.objectId);

            if(!keyboardTriggerIdsRef.current.size)
            {
                const enabledFromWindow = ((window as any).walkKeysEnabled || (window as any).vimKeysEnabled);
                setCanSendKeyboardInput(enabledFromWindow);
            }
        }
    });

    // ------------------------------
    //   LÓGICA DEL WIRED MONITOR
    // ------------------------------
    useMessageEvent<RoomRightsEvent>(RoomRightsEvent, event =>
    {
        if(!roomSession) return;
        const controllerLevel = event.getParser().controllerLevel;
        setCanUseWiredMonitor((controllerLevel >= RoomControllerLevel.GUEST) || roomSession.isRoomOwner || isMod);
    });

    useMessageEvent<RoomRightsClearEvent>(RoomRightsClearEvent, _ =>
    {
        if(!roomSession) return;
        setCanUseWiredMonitor(roomSession.isRoomOwner || isMod);
    });

    useMessageEvent<RoomRightsOwnerEvent>(RoomRightsOwnerEvent, _ =>
    {
        setCanUseWiredMonitor(true);
    });

    useEffect(() =>
    {
        if(!roomSession)
        {
            setCanUseWiredMonitor(false);
            return;
        }
        setCanUseWiredMonitor(roomSession.isRoomOwner || isMod || (roomSession.controllerLevel >= RoomControllerLevel.GUEST));
    }, [roomSession, isMod]);
    // Actualizar estado de canSendKeyboardInput si el servidor activa walk/vim keys
    useMessageEvent<PlayerWalkKeysEvent>(PlayerWalkKeysEvent, event =>
    {
        const parser = event.getParser();

        const enabledFromWindow = ((window as any).walkKeysEnabled || (window as any).vimKeysEnabled);
        setCanSendKeyboardInput((keyboardTriggerIdsRef.current.size > 0) || parser.isEnabled || enabledFromWindow);
    });

    useMessageEvent<PlayerVimKeysEvent>(PlayerVimKeysEvent, event =>
    {
        const parser = event.getParser();

        const enabledFromWindow = ((window as any).walkKeysEnabled || (window as any).vimKeysEnabled);
        setCanSendKeyboardInput((keyboardTriggerIdsRef.current.size > 0) || parser.isEnabled || enabledFromWindow);
    });
    // ------------------------------

    // Controles del teclado
    useEffect(() => 
    {
        if(!canSendKeyboardInput || !roomSession) return;

        const handleKeyDown = (event: KeyboardEvent) =>
        {
            let command = '';
            if ((window as any).vimKeysEnabled)
            {
                switch (event.key.toLowerCase())
                {
                    case 'h': command = 'h'; break;
                    case 'j': command = 'j'; break;
                    case 'k': command = 'k'; break;
                    case 'l': command = 'l'; break;
                    case ' ': command = 'space'; break;
                    default: return;
                }
            }
            else
            {
                const keys = ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","w","W","s","S","a","A","d","D"," ","Alt","Control","Shift"];
                if(keys.includes(event.key))
                {
                    command = event.key === " " ? "space" : event.key.toLowerCase();
                }
                else return;
            }
            SendMessageComposer(new KeyboardInputMessageComposer(command));
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [ canSendKeyboardInput, roomSession ]);

    // Render del toolbar
    return (
        <>
            <TransitionAnimation type={TransitionAnimationTypes.FADE_IN} inProp={isMeExpanded} timeout={300}>
                <ToolbarMeView useGuideTool={useGuideTool} unseenAchievementCount={getTotalUnseen} setMeExpanded={setMeExpanded} />
            </TransitionAnimation>

            <Flex alignItems="center" justifyContent="between" gap={2} className="nitro-toolbar py-1 px-3">
                <Flex gap={2} alignItems="center">
                    <Flex alignItems="center" gap={2}>
                        <Flex center pointer className={'navigation-item item-avatar ' + (isMeExpanded ? 'active ' : '')} onClick={() => setMeExpanded(!isMeExpanded)}>
                            <LayoutAvatarImageView figure={userFigure} direction={2} position="absolute" />
                            {(getTotalUnseen > 0) && <LayoutItemCountView count={getTotalUnseen} />}
                        </Flex>

                        {isInRoom && <Base pointer className="navigation-item icon icon-habbo" onClick={() => VisitDesktop()} />}
                        {!isInRoom && <Base pointer className="navigation-item icon icon-house" onClick={() => CreateLinkEvent('navigator/goto/home')} />}
                        <Base pointer className="navigation-item icon icon-rooms" onClick={() => CreateLinkEvent('navigator/toggle')} />
                        {GetConfiguration('game.center.enabled') && <Base pointer className="navigation-item icon icon-game" onClick={() => CreateLinkEvent('games/toggle')} />}
                        <Base pointer className="navigation-item icon icon-catalog" onClick={() => CreateLinkEvent('catalog/toggle')} />
                        <Base pointer className="navigation-item icon icon-inventory" onClick={() => CreateLinkEvent('inventory/toggle')}>
                            {(getFullCount > 0) && <LayoutItemCountView count={getFullCount} />}
                        </Base>

                        {isInRoom && <Base pointer className="navigation-item icon icon-camera" onClick={() => CreateLinkEvent('camera/toggle')} />}
                        {canUseWiredMonitor && isInRoom && <Base pointer className="navigation-item icon icon-wired-monitor" onClick={() => CreateLinkEvent('wired-monitor/toggle')} />}
                        {isMod && <Base pointer className="navigation-item icon icon-modtools" onClick={() => CreateLinkEvent('mod-tools/toggle')} />}
                    </Flex>

                    <Flex alignItems="center" id="toolbar-chat-input-container" />
                </Flex>

                <Flex alignItems="center" gap={2}>
                    <Flex gap={2}>
                        <Base pointer className="navigation-item icon icon-friendall" onClick={() => CreateLinkEvent('friends/toggle')}>
                            {(requests.length > 0) && <LayoutItemCountView count={requests.length} />}
                        </Base>

                        {((iconState === MessengerIconState.SHOW) || (iconState === MessengerIconState.UNREAD)) &&
                            <Base pointer className={`navigation-item icon icon-message ${(iconState === MessengerIconState.UNREAD) && 'is-unseen'}`} onClick={() => OpenMessengerChat()} />}
                    </Flex>

                    <Base id="toolbar-friend-bar-container" className="d-none d-lg-block" />
                </Flex>
            </Flex>
        </>
    );
};
