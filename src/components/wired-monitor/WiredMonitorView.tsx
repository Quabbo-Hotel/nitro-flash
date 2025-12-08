import { BadgePointLimitsEvent, ILinkEventTracker, IRoomSession, RoomControllerLevel, RoomPreviewer, RoomRightsClearEvent, RoomRightsEvent, RoomSessionEvent, SaveWiredSettingsComposer } from '@nitrots/nitro-renderer';
import { ToggleHighlightModeComposer } from '@nitrots/nitro-renderer/src/nitro/communication/messages/outgoing/room/variables/ToggleHighlightModeComposer';
import { ToggleFurniInspectionLockComposer } from '@nitrots/nitro-renderer/src/nitro/communication/messages/outgoing/room/variables/ToggleFurniInspectionLockComposer';
import { ToggleGlobalInspectionComposer } from '@nitrots/nitro-renderer/src/nitro/communication/messages/outgoing/room/variables/ToggleGlobalInspectionComposer';
import { ToggleUserInspectionLockComposer } from '@nitrots/nitro-renderer/src/nitro/communication/messages/outgoing/room/variables/ToggleUserInspectionLockComposer';
import { FC, useCallback, useEffect, useState } from 'react';
import { AddEventLinkTracker, GetLocalization, GetRoomEngine, GetSessionDataManager, IRoomData, LocalizeText, RemoveLinkEventTracker, SendMessageComposer } from '../../api';
import { Text, Flex, NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from '../../common';
import {  useMessageEvent, useNavigator, useRoomSessionManagerEvent } from '../../hooks';
import { useVariableHighlight } from '../../hooks/rooms/widgets/variables/useVariableHighlight';
import { ConfigTabView } from './ConfigTabView';
import { InspectionTabView } from './InspectionTabView';
import { VariableTabView } from './VariableTabView';

const TAB_VARIABLES: string = 'wired-monitor.variables';
const TAB_INSPECCION: string = 'wired-monitor.inspection';
const TAB_CONFIGURACION: string = 'wired-monitor.configuration';
const TABS = [TAB_VARIABLES, TAB_INSPECCION, TAB_CONFIGURACION];

export const WiredMonitorView: FC<{}> = props => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentTab, setCurrentTab] = useState<string>(TABS[0]);
    const [roomSession, setRoomSession] = useState<IRoomSession>(null);
    const [roomPreviewer, setRoomPreviewer] = useState<RoomPreviewer>(null);
    const [roomData, setRoomData] = useState<IRoomData>(null);
    const { clearHighlights } = useVariableHighlight();
    const { navigatorData = null } = useNavigator();

    const isOwner = navigatorData?.currentRoomOwner || false;

    const releaseInspectionSubscriptions = useCallback(() => {
        SendMessageComposer(new ToggleGlobalInspectionComposer(false));
        SendMessageComposer(new ToggleFurniInspectionLockComposer(false));
        SendMessageComposer(new ToggleUserInspectionLockComposer(false));
    }, []);

    const handleChange = (field: string, value: string | number | boolean | string[]) => {
        setRoomData(prevValue => {
            const newValue = { ...prevValue };

            switch (field) {
                case 'modify_wired':
                    newValue.modify_wired = Number(value);
                    break;
                case 'inspect_wired':
                    newValue.inspect_wired = Number(value);
                    break;
            }

            // Send the composer
            SendMessageComposer(
                new SaveWiredSettingsComposer(
                    newValue.roomId,
                    newValue.modify_wired,
                    newValue.inspect_wired
                ));

            return newValue;
        });
    }

    const onClose = () => {
        // Clear any active highlights when closing the monitor
        clearHighlights();
        // Also notify backend to disable highlight state
        SendMessageComposer(new ToggleHighlightModeComposer(false));

        setIsVisible(false);
    }

    useRoomSessionManagerEvent<RoomSessionEvent>([
        RoomSessionEvent.CREATED,
        RoomSessionEvent.ENDED
    ], event => {
        switch (event.type) {
            case RoomSessionEvent.CREATED:
                setRoomSession(event.session);
                // Initialize roomData with defaults, since we only need roomId for saving wired settings
                setRoomData({
                    roomId: event.session.roomId,
                    roomName: '',
                    roomDescription: '',
                    categoryId: 0,
                    userCount: 0,
                    tags: [],
                    tradeState: 0,
                    allowWalkthrough: false,
                    lockState: 0,
                    password: null,
                    allowPets: false,
                    allowPetsEat: false,
                    hideWalls: false,
                    wallThickness: 0,
                    floorThickness: 0,
                    ownerId: GetSessionDataManager().userId,
                    modify_wired: 0,
                    inspect_wired: 0,
                    chatSettings: {
                        mode: 0,
                        weight: 0,
                        speed: 0,
                        distance: 0,
                        protection: 0
                    },
                    moderationSettings: {
                        allowMute: 0,
                        allowKick: 0,
                        allowBan: 0
                    }
                });
                return;
            case RoomSessionEvent.ENDED:
                setRoomSession(null);
                setRoomData(null);
                // Clear highlights when leaving the room
                clearHighlights();
                // Notify backend to disable highlight state when leaving room
                SendMessageComposer(new ToggleHighlightModeComposer(false));
                setIsVisible(false);
                return;
        }
    });

    useMessageEvent<BadgePointLimitsEvent>(BadgePointLimitsEvent, event => {
        const parser = event.getParser();

        for (const data of parser.data) GetLocalization().setBadgePointLimit(data.badgeId, data.limit);
    });

    useEffect(() => {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) => {
                const parts = url.split('/');

                if (parts.length < 2) return;

                switch (parts[1]) {
                    case 'show':
                        setIsVisible(true);
                        return;
                    case 'hide':
                        setIsVisible(false);
                        return;
                    case 'toggle':
                        setIsVisible(prevValue => !prevValue);
                        return;
                }
            },
            eventUrlPrefix: 'wired-monitor/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, []);

    useEffect(() => {
        setRoomPreviewer(new RoomPreviewer(GetRoomEngine(), ++RoomPreviewer.PREVIEW_COUNTER));

        return () => {
            setRoomPreviewer(prevValue => {
                prevValue.dispose();

                return null;
            });
        }
    }, []);

    // Cerrar automáticamente si se pierden los permisos necesarios
    useMessageEvent<RoomRightsEvent>(RoomRightsEvent, event => {
        if (!isVisible) return; // no hace falta evaluar si no está abierto

        const parser = event.getParser();
        const controllerLevel = parser.controllerLevel;
        const isOwner = roomSession?.isRoomOwner || false;
        const isMod = GetSessionDataManager().isModerator;

        // Si ya no alcanza nivel de invitado y no es dueño ni moderador => cerrar
        if ((controllerLevel < RoomControllerLevel.GUEST) && !isOwner && !isMod) {
            clearHighlights();
            // Notify backend to disable highlight state on rights loss
            SendMessageComposer(new ToggleHighlightModeComposer(false));
            setIsVisible(false);
        }
    });

    useMessageEvent<RoomRightsClearEvent>(RoomRightsClearEvent, _ => {
        if (!isVisible) return;

        const isOwner = roomSession?.isRoomOwner || false;
        const isMod = GetSessionDataManager().isModerator;

        if (!isOwner && !isMod) {
            clearHighlights();
            // Notify backend to disable highlight state on rights clear
            SendMessageComposer(new ToggleHighlightModeComposer(false));
            setIsVisible(false);
        }
    });

    const getHeaderText = (tab: string) => {
        switch (tab) {
            case TAB_VARIABLES:
                return 'Variable Overview';
            case TAB_INSPECCION:
                return 'Variable Inspection';
            case TAB_CONFIGURACION:
                return 'Settings';
            default:
                return '';
        }
    };

    useEffect(() => {
        if (isVisible) return;

        releaseInspectionSubscriptions();
    }, [isVisible, releaseInspectionSubscriptions]);

    useEffect(() => {
        return () => {
            releaseInspectionSubscriptions();
        };
    }, [releaseInspectionSubscriptions]);

    if (!isVisible) return null;

    return (
        <NitroCardView className='nitro-wired-monitor-view' uniqueKey={'wired-monitor'}>
            <NitroCardHeaderView headerText={LocalizeText('wired-monitor.title')} onCloseClick={onClose} />
            <>
                <NitroCardTabsView isCentered={true}>
                    {TABS.map((name, index) => {
                        return (
                            <NitroCardTabsItemView style={{padding:"0.2rem 2.9rem"}} key={index} isActive={(currentTab === name)} onClick={event => setCurrentTab(name)}>
                                {LocalizeText(name)}
                            </NitroCardTabsItemView>

                        );
                    })}
                </NitroCardTabsView>
                <Flex center className='header-monitor-banner'>
                    <Text className='text-header-monitor ubuntu-bold'>{getHeaderText(currentTab)}</Text>
                </Flex>
                <NitroCardContentView>
                    {(currentTab === TAB_VARIABLES) &&
                        <VariableTabView />
                    }
                    {(currentTab === TAB_INSPECCION) &&
                        <InspectionTabView roomPreviewer={roomPreviewer} />
                    }
                    {(currentTab === TAB_CONFIGURACION) &&
                        <ConfigTabView roomData={roomData} handleChange={handleChange} isOwner={isOwner} />
                    }
                </NitroCardContentView>

            </>
        </NitroCardView>
    );
}
