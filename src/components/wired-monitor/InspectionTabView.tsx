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
import { LayoutRoomPreviewerView } from '../../common';
import { useMessageEvent, useRoomEngineEvent } from '../../hooks';
import './WiredMonitorView.scss';

export interface InspectionTabViewProps
{
    roomPreviewer?: RoomPreviewer;
}

type InspectorTarget = 'furni' | 'entity' | 'global';

export const InspectionTabView: FC<InspectionTabViewProps> = props =>
{
    const { roomPreviewer = null } = props;
    const [ activeTarget, setActiveTarget ] = useState<InspectorTarget>('furni');
    const [ furniVariables, setFurniVariables ] = useState<Map<string, string>>(new Map());
    const [ entityVariables, setEntityVariables ] = useState<Map<string, string>>(new Map());
    const [ globalVariables, setGlobalVariables ] = useState<Map<string, string>>(new Map());
    const [ selectedFurniId, setSelectedFurniId ] = useState<number | null>(null);
    const [ selectedEntityId, setSelectedEntityId ] = useState<number | null>(null);
    const [ keepSelected, setKeepSelected ] = useState(false);
    const [ lockedTarget, setLockedTarget ] = useState<InspectorTarget | null>(null);
    const selectedFurniIdRef = useRef<number | null>(null);
    const furniPreviewVirtualIdRef = useRef<number | null>(null);
    const selectedEntityIdRef = useRef<number | null>(null);
    const entityPreviewFigureRef = useRef<string | null>(null);
    const entityPreviewTypeRef = useRef<string | null>(null);
    const lockedTargetRef = useRef<InspectorTarget | null>(null);
    const globalInspectionEnabledRef = useRef(false);

    const displayedVariables = (activeTarget === 'entity') ? entityVariables : (activeTarget === 'global' ? globalVariables : furniVariables);
    const hasSelection = (activeTarget === 'entity') ? (selectedEntityId !== null) : (activeTarget === 'furni' ? (selectedFurniId !== null) : false);
    const canUseSelectionLock = (activeTarget !== 'global');

    const enableGlobalInspection = () =>
    {
        SendMessageComposer(new ToggleGlobalInspectionComposer(true));
        globalInspectionEnabledRef.current = true;
    };

    const disableGlobalInspection = () =>
    {
        if(!globalInspectionEnabledRef.current) return;

        SendMessageComposer(new ToggleGlobalInspectionComposer(false));
        globalInspectionEnabledRef.current = false;
    };

    const releaseLock = (target: InspectorTarget | null) =>
    {
        if(!target) return;

        if(target === 'global')
        {
            disableGlobalInspection();
            return;
        }

        if(target === 'furni') SendMessageComposer(new ToggleFurniInspectionLockComposer(false));
        else SendMessageComposer(new ToggleUserInspectionLockComposer(false));
    };

    const renderFurniPreview = (virtualId: number | null) =>
    {
        if(!roomPreviewer || !virtualId) return;

        const stuffData = GetFurnitureData(virtualId, 's');

        if(!stuffData) return;

        roomPreviewer.reset(false);
        roomPreviewer.updateObjectRoom('101', '101', '1.1');
        roomPreviewer.updateRoomWallsAndFloorVisibility(true, true);
        roomPreviewer.addFurnitureIntoRoom(virtualId, new Vector3d(90), stuffData as any, '');
        roomPreviewer.updatePreviewRoomView();
    };

    const looksLikePetFigure = (figure: string) =>
    {
        const normalized = figure.toLowerCase();

        return (figure.indexOf(' ') >= 0) || normalized.startsWith('pet') || normalized.startsWith('mnstr');
    };

    const renderUserPreview = (figure: string | null, entityType: string | null = null) =>
    {
        if(!roomPreviewer || !figure) return;

        const normalizedType = entityType ? entityType.toUpperCase() : null;
        const showAsPet = (normalizedType === 'PET') || looksLikePetFigure(figure);

        if(showAsPet)
        {
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

    const handleTargetChange = (target: InspectorTarget) =>
    {
        if(target === activeTarget) return;

        if(activeTarget === 'global') disableGlobalInspection();

        if(keepSelected)
        {
            releaseLock(lockedTarget);
            setKeepSelected(false);
            setLockedTarget(null);
        }

        setActiveTarget(target);

        if(target === 'global')
        {
            roomPreviewer?.reset(false);
            enableGlobalInspection();
            return;
        }

        if(target === 'furni')
        {
            if(furniPreviewVirtualIdRef.current) renderFurniPreview(furniPreviewVirtualIdRef.current);
            else roomPreviewer?.reset(false);

            return;
        }

        if(target === 'entity')
        {
            if(entityPreviewFigureRef.current) renderUserPreview(entityPreviewFigureRef.current, entityPreviewTypeRef.current);
            else roomPreviewer?.reset(false);
        }
    };

    const handleKeepSelectedChange = (checked: boolean) =>
    {
        if(activeTarget === 'global') return;

        let currentTargetId: number | null = null;

        if(activeTarget === 'furni') currentTargetId = selectedFurniIdRef.current;
        else currentTargetId = selectedEntityIdRef.current;

        if(checked)
        {
            if(currentTargetId === null) return;

            setKeepSelected(true);
            setLockedTarget(activeTarget);

            if(activeTarget === 'furni') SendMessageComposer(new ToggleFurniInspectionLockComposer(true, currentTargetId));
            else SendMessageComposer(new ToggleUserInspectionLockComposer(true, currentTargetId));

            return;
        }

        releaseLock(lockedTarget);
        setKeepSelected(false);
        setLockedTarget(null);
    };

    useMessageEvent<GetFurniVariablesAndValuesMessageEvent>(GetFurniVariablesAndValuesMessageEvent, event =>
    {
        const parser = event.getParser();
        const isLockedToOther = keepSelected && lockedTarget === 'furni' && selectedFurniIdRef.current !== null && parser.furniId !== selectedFurniIdRef.current;

        if(isLockedToOther) return;

        const furniChanged = selectedFurniIdRef.current !== parser.furniId;
        selectedFurniIdRef.current = parser.furniId;
        furniPreviewVirtualIdRef.current = parser.virtualId;

        setSelectedFurniId(prev => (prev === parser.furniId ? prev : parser.furniId));
        setFurniVariables(new Map(parser.variables));

        if(furniChanged && activeTarget === 'furni') renderFurniPreview(parser.virtualId);
    });

    useMessageEvent<GetUserVariablesAndValuesMessageEvent>(GetUserVariablesAndValuesMessageEvent, event =>
    {
        const parser = event.getParser();
        const isLockedToOther = keepSelected && (lockedTarget === 'entity') && (selectedEntityIdRef.current !== null) && (parser.userId !== selectedEntityIdRef.current);

        if(isLockedToOther) return;

        const entityChanged = selectedEntityIdRef.current !== parser.userId;

        selectedEntityIdRef.current = parser.userId;
        entityPreviewFigureRef.current = parser.figure;

        const nextVariables = new Map(parser.variables);
        const typeHint = nextVariables.get('@type_user') ?? null;
        const normalizedType = typeHint ? typeHint.toUpperCase() : null;

        entityPreviewTypeRef.current = normalizedType;

        setSelectedEntityId(prev => (prev === parser.userId ? prev : parser.userId));
        setEntityVariables(nextVariables);

        if(entityChanged && (activeTarget === 'entity')) renderUserPreview(parser.figure, normalizedType);
    });

    useMessageEvent<GetGlobalVariablesAndValuesMessageEvent>(GetGlobalVariablesAndValuesMessageEvent, event =>
    {
        const parser = event.getParser();
        setGlobalVariables(new Map(parser.variables));
    });

    useRoomEngineEvent<RoomEngineObjectEvent>(RoomEngineObjectEvent.SELECTED, event =>
    {
        if(event.category !== RoomObjectCategory.UNIT) return;
        if(keepSelected && (lockedTarget === 'entity') && (selectedEntityIdRef.current !== null)) return;

        const session = GetRoomSession();

        if(!session) return;

        const userData = session.userDataManager?.getUserDataByIndex(event.objectId);

        if(!userData) return;

        if(activeTarget !== 'entity') handleTargetChange('entity');

        if(userData.type === RoomObjectUserType.getTypeNumber(RoomObjectUserType.PET)) entityPreviewTypeRef.current = 'PET';
        else if(userData.type === RoomObjectUserType.getTypeNumber(RoomObjectUserType.BOT)) entityPreviewTypeRef.current = 'BOT';
        else entityPreviewTypeRef.current = 'PLAYER';

        SendMessageComposer(new InspectUserVariablesComposer(userData.webID));
    });

    useEffect(() =>
    {
        if(!keepSelected) return;

        if(lockedTarget === 'furni' && selectedFurniId === null)
        {
            releaseLock('furni');
            setKeepSelected(false);
            setLockedTarget(null);
        }

        if((lockedTarget === 'entity') && (selectedEntityId === null))
        {
            releaseLock('entity');
            setKeepSelected(false);
            setLockedTarget(null);
        }
    }, [ keepSelected, lockedTarget, selectedFurniId, selectedEntityId ]);

    useEffect(() =>
    {
        lockedTargetRef.current = lockedTarget;
    }, [ lockedTarget ]);

    useEffect(() =>
    {
        return () =>
        {
            releaseLock(lockedTargetRef.current);
            disableGlobalInspection();
        };
    }, []);

    return (
        <div className="global-grid">
            diseño provisional btw
            <div className="grid-container2-props">
                <div>
                    <div className="container-selector">
                        <label style={{ display: 'block', marginBottom: 6 }}>Variable holder type:</label>
                        <div className="container-buttons-var" style={{ display: 'flex', gap: 8 }}>
                            <button
                                type="button"
                                title="Furni"
                                className={`button-var icon-furni-var${activeTarget === 'furni' ? ' is-active' : ''}`}
                                onClick={() => handleTargetChange('furni')} />
                            <button
                                type="button"
                                title="Entidad"
                                className={`button-var icon-user-var${activeTarget === 'entity' ? ' is-active' : ''}`}
                                onClick={() => handleTargetChange('entity')} />
                            <button
                                type="button"
                                title="Global"
                                className={`button-var icon-global-var${activeTarget === 'global' ? ' is-active' : ''}`}
                                onClick={() => handleTargetChange('global')}
                            />
                            <button
                                type="button"
                                title="Context"
                                className="button-var icon-context-var"
                                disabled
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: 8 }}>
                        <label style={{ display: 'block', marginBottom: 6 }}>Preview:</label>
                        <LayoutRoomPreviewerView roomPreviewer={roomPreviewer} height={230} />

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
                </div>
                <div />
                <div>
                    <label style={{ display: 'block', marginBottom: 6 }}>Variables:</label>
                    <div className="container-values-prop">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid #ccc' }}>Variable</th>
                                    <th style={{ textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid #ccc' }}>Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from(displayedVariables.entries()).map(([ name, value ]) => (
                                    <tr key={name}>
                                        <td style={{ padding: '6px 8px', borderBottom: '1px solid #eee', width: '60%' }}>{name}</td>
                                        <td style={{ padding: '6px 8px', borderBottom: '1px solid #eee' }}>{value}</td>
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
