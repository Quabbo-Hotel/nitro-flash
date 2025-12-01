import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NavigatorSearchEvent } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/navigator/NavigatorSearchEvent';
import { NavigatorSearchComposer } from '@nitrots/nitro-renderer/src/nitro/communication/messages/outgoing/navigator/NavigatorSearchComposer';
import { RoomDataParser } from '@nitrots/nitro-renderer/src/nitro/communication/messages/parser/room/data/RoomDataParser';
import { SharedRoomVariablesMessageEvent } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/room/variables/SharedRoomVariablesMessageEvent';
import { ISharedRoomVariableEntry } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/parser/room/variables/SharedRoomVariablesMessageParser';
import { RequestSharedRoomVariablesComposer } from '@nitrots/nitro-renderer/src/nitro/communication/messages/outgoing/room/variables/RequestSharedRoomVariablesComposer';
import { WIRED_STRING_DELIMETER, SendMessageComposer } from '../../../../api';
import { Column, Text } from '../../../../common';
import { useMessageEvent } from '../../../../hooks/events';
import { useNavigator, useNotification, useWired } from '../../../../hooks';
import { WiredAddonBaseView } from './WiredAddonBaseView';

const TARGET_GLOBAL = 0;
const TARGET_USER = 1;
const READ_ONLY_FLAG = 1;

interface SharedRoomCacheEntry {
    roomName: string;
    variables: ISharedRoomVariableEntry[];
}

const parseStoredPayload = (raw?: string | null): [string, string, string, number] =>
{
    if(!raw) return ['', '', '', TARGET_GLOBAL];

    const parts = raw.split(WIRED_STRING_DELIMETER);
    const storedLocal = parts[0] || '';
    const storedRoom = parts[1] || '';
    const storedVariable = parts[2] || '';
    const storedType = parseInt(parts[3] || '', 10);

    return [ storedLocal, storedRoom, storedVariable, Number.isNaN(storedType) ? TARGET_GLOBAL : storedType ];
};

export const WiredAddonReferenceVariableView: FC = () =>
{
    const { trigger = null, setStringParam = null, setIntParams = null } = useWired();
    const { simpleAlert = null } = useNotification();
    const { navigatorData = null } = useNavigator();

    const [localName, setLocalName] = useState('');
    const [targetRoomId, setTargetRoomId] = useState('');
    const [targetVariable, setTargetVariable] = useState('');
    const [targetType, setTargetType] = useState(TARGET_GLOBAL);
    const [readOnly, setReadOnly] = useState(true);
    const [ownerRooms, setOwnerRooms] = useState<RoomDataParser[]>([]);
    const [roomsLoading, setRoomsLoading] = useState(false);
    const [sharedRooms, setSharedRooms] = useState<Record<string, SharedRoomCacheEntry>>({});
    const [loadingRooms, setLoadingRooms] = useState<Record<string, boolean>>({});
    const ownerSearchKeyRef = useRef<string | null>(null);
    const sharedRoomsRef = useRef<Record<string, SharedRoomCacheEntry>>({});
    const pendingRoomRequestsRef = useRef<Set<string>>(new Set());

    const sharedVarsForTargetRoom = useMemo(() =>
    {
        if(!targetRoomId) return [];

        return sharedRooms[targetRoomId]?.variables || [];
    }, [ targetRoomId, sharedRooms ]);

    const sharedVarSelectValue = useMemo(() =>
    {
        return sharedVarsForTargetRoom.find(entry => entry.name === targetVariable) ? targetVariable : '';
    }, [ sharedVarsForTargetRoom, targetVariable ]);

    const sharedVarsLoading = !!(targetRoomId && loadingRooms[targetRoomId]);
    const sharedRoomHasResponse = !!(targetRoomId && sharedRooms[targetRoomId]);
    const roomsWithSharedVars = useMemo(() =>
    {
        return ownerRooms.filter(room =>
        {
            const entry = sharedRooms[String(room.roomId)];
            return !!(entry && entry.variables.length > 0);
        });
    }, [ ownerRooms, sharedRooms ]);
    const awaitingSharedResponses = useMemo(() =>
    {
        if(ownerRooms.length === 0) return false;
        return ownerRooms.some(room => !sharedRooms[String(room.roomId)]);
    }, [ ownerRooms, sharedRooms ]);

    const ownerName = navigatorData?.enteredGuestRoom?.ownerName ?? '';

    useEffect(() =>
    {
        setOwnerRooms([]);
        ownerSearchKeyRef.current = null;
        setRoomsLoading(false);
        setSharedRooms({});
        sharedRoomsRef.current = {};
        setLoadingRooms({});

        if(!ownerName) return;
        const code = 'hotel_view';
        const data = `owner:${ ownerName }`;
        ownerSearchKeyRef.current = `${ code }|${ data }`;
        setRoomsLoading(true);
        SendMessageComposer(new NavigatorSearchComposer(code, data));
    }, [ ownerName ]);

    useMessageEvent<NavigatorSearchEvent>(NavigatorSearchEvent, event =>
    {
        const parser = event.getParser();
        const key = `${ parser.result.code }|${ parser.result.data }`;
        if(key !== ownerSearchKeyRef.current) return;

        const aggregated: RoomDataParser[] = [];
        parser.result.results?.forEach(result =>
        {
            if(!result || !result.rooms) return;
            aggregated.push(...result.rooms);
        });

        setOwnerRooms(aggregated);
        setRoomsLoading(false);
    });

    useMessageEvent<SharedRoomVariablesMessageEvent>(SharedRoomVariablesMessageEvent, event =>
    {
        const parser = event.getParser();
        const roomKey = String(parser.roomId);
        setSharedRooms(prev =>
        {
            const next = {
                ...prev,
                [roomKey]: {
                    roomName: parser.roomName,
                    variables: parser.entries.slice()
                }
            };
            sharedRoomsRef.current = next;
            return next;
        });
        pendingRoomRequestsRef.current.delete(roomKey);
        setLoadingRooms(prev =>
        {
            const next = { ...prev };
            delete next[roomKey];
            return next;
        });
    });

    const requestSharedVariables = useCallback((roomIdValue?: string, force = false) =>
    {
        const resolved = (roomIdValue ?? targetRoomId ?? '').trim();
        if(!resolved) return;

        const parsed = parseInt(resolved, 10);
        if(Number.isNaN(parsed) || (parsed <= 0)) return;
        if(!force && (sharedRoomsRef.current[resolved] || pendingRoomRequestsRef.current.has(resolved))) return;

        setLoadingRooms(prev => ({ ...prev, [resolved]: true }));
        pendingRoomRequestsRef.current.add(resolved);
        SendMessageComposer(new RequestSharedRoomVariablesComposer(parsed));
    }, [ targetRoomId ]);

    const handleRoomSelection = useCallback((value: string) =>
    {
        if(value !== targetRoomId)
        {
            setTargetVariable('');
            setTargetType(TARGET_GLOBAL);
        }
        setTargetRoomId(value);
    }, [ targetRoomId ]);

    useEffect(() =>
    {
        if(!targetRoomId) return;

        requestSharedVariables(targetRoomId);
    }, [ targetRoomId, requestSharedVariables ]);

    useEffect(() =>
    {
        if(ownerRooms.length === 0) return;

        ownerRooms.forEach(room => requestSharedVariables(String(room.roomId)));
    }, [ ownerRooms, requestSharedVariables ]);

    useEffect(() =>
    {
        const [ storedLocal, storedRoom, storedVariable, storedType ] = parseStoredPayload(trigger?.stringData);
        setLocalName(storedLocal);
        setTargetRoomId(storedRoom);
        setTargetVariable(storedVariable);
        setTargetType(storedType);
        if(trigger && trigger.intData.length > 0)
        {
            setReadOnly(trigger.intData[0] === READ_ONLY_FLAG);
        }
        else
        {
            setReadOnly(true);
        }
    }, [ trigger ]);

    const save = () =>
    {
        const trimmedLocal = localName.trim();
        const trimmedVariable = targetVariable.trim();
        const resolvedRoomId = parseInt(targetRoomId.trim(), 10);

        if(!trimmedLocal)
        {
            simpleAlert?.('Define un nombre para usar esta referencia en la sala.');
            return;
        }

        if(Number.isNaN(resolvedRoomId) || (resolvedRoomId <= 0))
        {
            simpleAlert?.('Selecciona la sala origen de la variable compartida.');
            return;
        }

        if(!trimmedVariable)
        {
            simpleAlert?.('Selecciona una variable compartida de la sala origen.');
            return;
        }

        const payload = [ trimmedLocal, String(resolvedRoomId), trimmedVariable, String(targetType) ].join(WIRED_STRING_DELIMETER);
        setStringParam?.(payload);
        setIntParams?.([ readOnly ? READ_ONLY_FLAG : 0 ]);
    };

    return (
        <WiredAddonBaseView hasSpecialInput save={ save } requiresFurni={ 0 }>
            <Column gap={ 1 }>
                <Text bold>Nombre en esta sala</Text>
                <input
                    type='text'
                    className='form-control form-control-sm'
                    maxLength={ 64 }
                    value={ localName }
                    onChange={ event => setLocalName(event.target.value) }
                    placeholder='Ej. puntuacion_global'
                />

                <Text bold>Sala origen</Text>
                <select
                    className='form-select form-select-sm'
                    value={ targetRoomId }
                    onChange={ event => handleRoomSelection(event.target.value) }
                >
                    <option value=''>Selecciona una sala con variables compartidas</option>
                    { roomsWithSharedVars.map(room => (
                        <option key={ room.roomId } value={ String(room.roomId) }>
                            { room.roomName } (#{ room.roomId })
                        </option>
                    )) }
                    { (!!targetRoomId && !roomsWithSharedVars.find(room => String(room.roomId) === targetRoomId)) && (
                        <option value={ targetRoomId }>
                            Sala #{ targetRoomId }
                        </option>
                    ) }
                </select>
                { roomsLoading && <Text small variant='muted'>Buscando salas del propietario…</Text> }
                { (!roomsLoading && ownerRooms.length > 0 && roomsWithSharedVars.length === 0 && awaitingSharedResponses) && <Text small variant='muted'>Buscando salas con variables compartidas…</Text> }
                { (!roomsLoading && ownerRooms.length > 0 && roomsWithSharedVars.length === 0 && !awaitingSharedResponses) && <Text small variant='muted'>Ninguna sala del propietario tiene variables compartidas permanentes.</Text> }

                <Text bold>Variables compartidas en sala</Text>
                <select
                    className='form-select form-select-sm'
                    value={ sharedVarSelectValue }
                    disabled={ !targetRoomId || (sharedVarsForTargetRoom.length === 0) }
                    onChange={ event =>
                    {
                        const value = event.target.value;
                        if(!value)
                        {
                            setTargetVariable('');
                            return;
                        }
                        setTargetVariable(value);
                        const entry = sharedVarsForTargetRoom.find(item => item.name === value);
                        if(entry) setTargetType(entry.target === TARGET_USER ? TARGET_USER : TARGET_GLOBAL);
                    } }
                >
                    <option value=''>
                        { !targetRoomId ? 'Selecciona una sala primero' : (sharedVarsForTargetRoom.length === 0 ? 'Sin variables compartidas detectadas' : 'Selecciona una variable compartida') }
                    </option>
                    { sharedVarsForTargetRoom.map(entry => (
                        <option key={ entry.name } value={ entry.name }>
                            { entry.name } ({ entry.target === TARGET_USER ? 'usuario' : 'global' })
                        </option>
                    )) }
                </select>
                { !targetRoomId && <Text small variant='muted'>Selecciona una sala del propietario para ver sus variables compartidas.</Text> }
                { sharedVarsLoading && <Text small variant='muted'>Cargando variables compartidas…</Text> }
                { (!!targetRoomId && !sharedVarsLoading && sharedRoomHasResponse && (sharedVarsForTargetRoom.length === 0)) && <Text small variant='muted'>Esta sala no tiene variables permanentes compartidas.</Text> }
                <label className='form-check' style={{ marginTop: '0.75rem' }}>
                    <input
                        className='form-check-input'
                        type='checkbox'
                        checked={ readOnly }
                        onChange={ event => setReadOnly(event.target.checked) }
                    />
                    <Text style={{ marginLeft: '0.35rem' }}>Solo lectura</Text>
                </label>
                <Text small variant='muted'>Desmarca esta opción solo si permitirás que el addon intente escribir en la variable remota.</Text>

            </Column>
        </WiredAddonBaseView>
    );
};
