import { RoomEngineObjectEvent, RoomObjectCategory, RoomObjectUserType, RoomPreviewer, Vector3d } from '@nitrots/nitro-renderer';
import { GetFurniVariablesAndValuesMessageEvent } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/room/variables/GetFurniVariablesAndValuesMessageEvent';
import { GetGlobalVariablesAndValuesMessageEvent } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/room/variables/GetGlobalVariablesAndValuesMessageEvent';
import { GetUserVariablesAndValuesMessageEvent } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/room/variables/GetUserVariablesAndValuesMessageEvent';
import { InspectUserVariablesComposer } from '@nitrots/nitro-renderer/src/nitro/communication/messages/outgoing/room/variables/InspectUserVariablesComposer';
import { ToggleFurniInspectionLockComposer } from '@nitrots/nitro-renderer/src/nitro/communication/messages/outgoing/room/variables/ToggleFurniInspectionLockComposer';
import { ToggleGlobalInspectionComposer } from '@nitrots/nitro-renderer/src/nitro/communication/messages/outgoing/room/variables/ToggleGlobalInspectionComposer';
import { ToggleUserInspectionLockComposer } from '@nitrots/nitro-renderer/src/nitro/communication/messages/outgoing/room/variables/ToggleUserInspectionLockComposer';
import { FC, useEffect, useRef, useState } from 'react';
import { GetFurnitureData, GetRoomSession, SendMessageComposer } from '../../api';
import { Button, Text, Flex, LayoutRoomPreviewerView } from '../../common';
import { useMessageEvent, useRoomEngineEvent } from '../../hooks';
import './WiredMonitorView.scss';

export interface InspectionTabViewProps {
    roomPreviewer?: RoomPreviewer;
}

type InspectorTarget = 'furni' | 'entity' | 'global';

export const InspectionTabView: FC<InspectionTabViewProps> = props => {
    const { roomPreviewer = null } = props;
    const [activeTarget, setActiveTarget] = useState<InspectorTarget>('furni');
    const [furniVariables, setFurniVariables] = useState<Map<string, string>>(new Map());
    const [entityVariables, setEntityVariables] = useState<Map<string, string>>(new Map());
    const [globalVariables, setGlobalVariables] = useState<Map<string, string>>(new Map());
    const [selectedFurniId, setSelectedFurniId] = useState<number | null>(null);
    const [selectedEntityId, setSelectedEntityId] = useState<number | null>(null);
    const [keepSelected, setKeepSelected] = useState(false);
    const [lockedTarget, setLockedTarget] = useState<InspectorTarget | null>(null);
    const [changedFurni, setChangedFurni] = useState<Set<string>>(new Set());
    const [changedEntity, setChangedEntity] = useState<Set<string>>(new Set());
    const [changedGlobal, setChangedGlobal] = useState<Set<string>>(new Set());
    const changedTimeouts = useRef<Map<string, any>>(new Map());
    const selectedFurniIdRef = useRef<number | null>(null);
    const furniPreviewVirtualIdRef = useRef<number | null>(null);
    const selectedEntityIdRef = useRef<number | null>(null);
    const entityPreviewFigureRef = useRef<string | null>(null);
    const entityPreviewTypeRef = useRef<string | null>(null);
    const lockedTargetRef = useRef<InspectorTarget | null>(null);
    const globalInspectionEnabledRef = useRef(false);

    const displayedVariables = (activeTarget === 'entity') ? entityVariables : (activeTarget === 'global' ? globalVariables : furniVariables);
    const currentChanged = (activeTarget === 'entity') ? changedEntity : (activeTarget === 'global' ? changedGlobal : changedFurni);
    const hasSelection = (activeTarget === 'entity') ? (selectedEntityId !== null) : (activeTarget === 'furni' ? (selectedFurniId !== null) : false);
    const canUseSelectionLock = (activeTarget !== 'global');

    const enableGlobalInspection = () => {
        SendMessageComposer(new ToggleGlobalInspectionComposer(true));
        globalInspectionEnabledRef.current = true;
    };

    const disableGlobalInspection = () => {
        if (!globalInspectionEnabledRef.current) return;

        SendMessageComposer(new ToggleGlobalInspectionComposer(false));
        globalInspectionEnabledRef.current = false;
    };

    const releaseLock = (target: InspectorTarget | null) => {
        if (!target) return;

        if (target === 'global') {
            disableGlobalInspection();
            return;
        }

        if (target === 'furni') SendMessageComposer(new ToggleFurniInspectionLockComposer(false));
        else SendMessageComposer(new ToggleUserInspectionLockComposer(false));
    };

    const renderFurniPreview = (virtualId: number | null) => {
        if (!roomPreviewer || !virtualId) return;

        const stuffData = GetFurnitureData(virtualId, 's');

        if (!stuffData) return;

        roomPreviewer.reset(false);
        roomPreviewer.updateObjectRoom('101', '101', '1.1');
        roomPreviewer.updateRoomWallsAndFloorVisibility(true, true);
        roomPreviewer.addFurnitureIntoRoom(virtualId, new Vector3d(90), stuffData as any, '');
        roomPreviewer.updatePreviewRoomView();
    };

    const looksLikePetFigure = (figure: string) => {
        const normalized = figure.toLowerCase();

        return (figure.indexOf(' ') >= 0) || normalized.startsWith('pet') || normalized.startsWith('mnstr');
    };

    const renderUserPreview = (figure: string | null, entityType: string | null = null) => {
        if (!roomPreviewer || !figure) return;

        const normalizedType = entityType ? entityType.toUpperCase() : null;
        const showAsPet = (normalizedType === 'PET') || looksLikePetFigure(figure);

        if (showAsPet) {
            roomPreviewer.addPetIntoRoom(figure);
            roomPreviewer.updatePreviewRoomView();
            return;
        }

        roomPreviewer.reset(false);
        roomPreviewer.updateObjectRoom('101', '101', '1.1');
        roomPreviewer.updateRoomWallsAndFloorVisibility(true, true);
        roomPreviewer.addAvatarIntoRoom(figure, 0);
        roomPreviewer.updatePreviewRoomView();
    };

    const handleTargetChange = (target: InspectorTarget) => {
        if (target === activeTarget) return;

        if (activeTarget === 'global') disableGlobalInspection();

        if (keepSelected) {
            releaseLock(lockedTarget);
            setKeepSelected(false);
            setLockedTarget(null);
        }

        setActiveTarget(target);
        setChangedFurni(new Set());
        setChangedEntity(new Set());
        setChangedGlobal(new Set());
        changedTimeouts.current.forEach(timeout => clearTimeout(timeout));
        changedTimeouts.current.clear();

        if (target === 'global') {
            roomPreviewer?.reset(false);
            enableGlobalInspection();
            return;
        }

        if (target === 'furni') {
            if (furniPreviewVirtualIdRef.current) renderFurniPreview(furniPreviewVirtualIdRef.current);
            else roomPreviewer?.reset(false);

            return;
        }

        if (target === 'entity') {
            if (entityPreviewFigureRef.current) renderUserPreview(entityPreviewFigureRef.current, entityPreviewTypeRef.current);
            else roomPreviewer?.reset(false);
        }
    };

    const handleKeepSelectedChange = (checked: boolean) => {
        if (activeTarget === 'global') return;

        let currentTargetId: number | null = null;

        if (activeTarget === 'furni') currentTargetId = selectedFurniIdRef.current;
        else currentTargetId = selectedEntityIdRef.current;

        if (checked) {
            if (currentTargetId === null) return;

            setKeepSelected(true);
            setLockedTarget(activeTarget);

            if (activeTarget === 'furni') SendMessageComposer(new ToggleFurniInspectionLockComposer(true, currentTargetId));
            else SendMessageComposer(new ToggleUserInspectionLockComposer(true, currentTargetId));

            return;
        }

        releaseLock(lockedTarget);
        setKeepSelected(false);
        setLockedTarget(null);
    };

    useMessageEvent<GetFurniVariablesAndValuesMessageEvent>(GetFurniVariablesAndValuesMessageEvent, event => {
        const parser = event.getParser();
        const isLockedToOther = keepSelected && lockedTarget === 'furni' && selectedFurniIdRef.current !== null && parser.furniId !== selectedFurniIdRef.current;

        if (isLockedToOther) return;

        const furniChanged = selectedFurniIdRef.current !== parser.furniId;
        selectedFurniIdRef.current = parser.furniId;
        furniPreviewVirtualIdRef.current = parser.virtualId;

        setSelectedFurniId(prev => (prev === parser.furniId ? prev : parser.furniId));
        setFurniVariables(new Map(parser.variables));

        const changed = new Set<string>();
        for (const [key, value] of parser.variables) {
            if (furniVariables.get(key) !== value && key !== 'position_x' && key !== 'position_y' && key !== 'x' && key !== 'y') changed.add(key);
        }
        if (changed.size > 0) {
            setChangedFurni(prev => new Set([...prev, ...changed]));
            changed.forEach(key => {
                const existing = changedTimeouts.current.get(key);
                if (existing) clearTimeout(existing);
                changedTimeouts.current.set(key, setTimeout(() => {
                    setChangedFurni(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(key);
                        return newSet;
                    });
                    changedTimeouts.current.delete(key);
                }, 1000));
            });
        }

        if (furniChanged && activeTarget === 'furni') renderFurniPreview(parser.virtualId);
    });

    useMessageEvent<GetUserVariablesAndValuesMessageEvent>(GetUserVariablesAndValuesMessageEvent, event => {
        const parser = event.getParser();
        const isLockedToOther = keepSelected && (lockedTarget === 'entity') && (selectedEntityIdRef.current !== null) && (parser.userId !== selectedEntityIdRef.current);

        if (isLockedToOther) return;

        const entityChanged = selectedEntityIdRef.current !== parser.userId;

        selectedEntityIdRef.current = parser.userId;
        entityPreviewFigureRef.current = parser.figure;

        const nextVariables = new Map(parser.variables);
        const typeHint = nextVariables.get('@type_user') ?? null;
        const normalizedType = typeHint ? typeHint.toUpperCase() : null;

        entityPreviewTypeRef.current = normalizedType;

        setSelectedEntityId(prev => (prev === parser.userId ? prev : parser.userId));
        setEntityVariables(nextVariables);

        const changed = new Set<string>();
        for (const [key, value] of nextVariables) {
            if (entityVariables.get(key) !== value) changed.add(key);
        }
        if (changed.size > 0) {
            setChangedEntity(prev => new Set([...prev, ...changed]));
            changed.forEach(key => {
                const existing = changedTimeouts.current.get(key);
                if (existing) clearTimeout(existing);
                changedTimeouts.current.set(key, setTimeout(() => {
                    setChangedEntity(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(key);
                        return newSet;
                    });
                    changedTimeouts.current.delete(key);
                }, 1000));
            });
        }

        if (entityChanged && (activeTarget === 'entity')) renderUserPreview(parser.figure, normalizedType);
    });

    useMessageEvent<GetGlobalVariablesAndValuesMessageEvent>(GetGlobalVariablesAndValuesMessageEvent, event => {
        const parser = event.getParser();
        const newVars = new Map(parser.variables);
        setGlobalVariables(newVars);

        const changed = new Set<string>();
        for (const [key, value] of newVars) {
            if (globalVariables.get(key) !== value) changed.add(key);
        }
        if (changed.size > 0) {
            setChangedGlobal(prev => new Set([...prev, ...changed]));
            changed.forEach(key => {
                const existing = changedTimeouts.current.get(key);
                if (existing) clearTimeout(existing);
                changedTimeouts.current.set(key, setTimeout(() => {
                    setChangedGlobal(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(key);
                        return newSet;
                    });
                    changedTimeouts.current.delete(key);
                }, 1000));
            });
        }
    });

    useRoomEngineEvent<RoomEngineObjectEvent>(RoomEngineObjectEvent.SELECTED, event => {
        if (event.category !== RoomObjectCategory.UNIT || activeTarget !== 'entity') return;
        if (keepSelected && (lockedTarget === 'entity') && (selectedEntityIdRef.current !== null)) return;

        const session = GetRoomSession();

        if (!session) return;

        const userData = session.userDataManager?.getUserDataByIndex(event.objectId);

        if (!userData) return;

        if (userData.type === RoomObjectUserType.getTypeNumber(RoomObjectUserType.PET)) entityPreviewTypeRef.current = 'PET';
        else if (userData.type === RoomObjectUserType.getTypeNumber(RoomObjectUserType.BOT)) entityPreviewTypeRef.current = 'BOT';
        else entityPreviewTypeRef.current = 'PLAYER';

        SendMessageComposer(new InspectUserVariablesComposer(userData.webID));
    });

    useEffect(() => {
        if (!keepSelected) return;

        if (lockedTarget === 'furni' && selectedFurniId === null) {
            releaseLock('furni');
            setKeepSelected(false);
            setLockedTarget(null);
        }

        if ((lockedTarget === 'entity') && (selectedEntityId === null)) {
            releaseLock('entity');
            setKeepSelected(false);
            setLockedTarget(null);
        }
    }, [keepSelected, lockedTarget, selectedFurniId, selectedEntityId]);

    useEffect(() => {
        lockedTargetRef.current = lockedTarget;
    }, [lockedTarget]);

    useEffect(() => {
        return () => {
            releaseLock(lockedTargetRef.current);
            disableGlobalInspection();
            changedTimeouts.current.forEach(timeout => clearTimeout(timeout));
            changedTimeouts.current.clear();
        };
    }, []);

    return (
        <div className="global-grid">
            <div className="grid-container2-props">
                <div>
                    <div className="container-selector">

                        <Flex center column style={{ width: '100%' }}>
                            <Text className='text-left-container' >Variable type:</Text>
                        </Flex>
                        <Flex column style={{ width: '100%' }}>
                            <Flex center gap={3} className='container-buttons-var' style={{ width: '100%' }}>
                                <Flex center gap={3} className='container-buttons-var-inside'>
                                    <Button active={activeTarget === 'furni'} style={{ padding: "0" }} onClick={() => handleTargetChange('furni')}>
                                        <i className={`button-var icon-furni-var ${activeTarget === 'furni' ? 'selected' : ''}`}></i>
                                    </Button>
                                    <Button active={activeTarget === 'entity'} style={{ padding: "0" }} onClick={() => handleTargetChange('entity')}>
                                        <i className={`button-var icon-user-var ${activeTarget === 'entity' ? 'selected' : ''}`}></i>
                                    </Button>
                                    <Button active={activeTarget === 'global'} style={{ padding: "0" }} onClick={() => handleTargetChange('global')}>
                                        <i className={`button-var icon-global-var ${activeTarget === 'global' ? 'selected' : ''}`}></i>
                                    </Button>
                                </Flex>
                            </Flex>
                        </Flex>


                        <Flex column justifyContent='start' style={{ width: '100%' }}>
                            <Flex center column style={{ width: '100%' }}>
                                <Text style={{ marginBottom: "10px" }} className='text-left-container' >Variable picker:</Text>
                            </Flex>
                            <Flex column style={{ width: '100%' }}>

                                {activeTarget !== 'global' && <LayoutRoomPreviewerView isMonitorWired={true} roomPreviewer={roomPreviewer} height={240} />}
                                {activeTarget === 'global' && <div className='global-var-inspector' ></div>}
                            </Flex>

                        </Flex>
                    </div>
                    <div style={{ marginTop: 8 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <input
                                type="checkbox"
                                checked={canUseSelectionLock ? keepSelected : false}
                                disabled={!canUseSelectionLock || !hasSelection}
                                onChange={event => handleKeepSelectedChange(event.target.checked)}
                            />
                            <span>Keep furni/entity selected</span>
                        </label>
                    </div>
                </div>
                <div />
                <div>
                    <label style={{ display: 'block', marginBottom: 6,  }}>Variables:</label>
                    <div className="container-values-prop">
                        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                            <thead>
                                <tr>
                                    <th style={{textIndent:"4px", textAlign: 'left', borderBottom: '1px solid #ccc', padding: '2px', width: '100px', backgroundColor:"#f9f9f9" }}>Variable</th>
                                    <th style={{ textAlign: 'right',  borderBottom: '1px solid #ccc', padding: '2px', paddingRight: '6px', backgroundColor:"#f9f9f9" }}>Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from(displayedVariables.entries()).map(([name, value], index) => (
                                    <tr key={name} style={{ backgroundColor: currentChanged.has(name) ? '#b8e2fc' : (index % 2 === 0 ? 'white' : '#eaeaea') }}>
                                        <td style={{ padding:"2px" , width: '100px' }}><div style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }} title={name}>{name}</div></td>
                                        <td style={{ padding:"2px" }}><div style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', textAlign: 'right', paddingRight: '4px' }} title={value}>{value}</div></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
