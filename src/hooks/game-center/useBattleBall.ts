import { JoinQueueMessageComposer, NitroConfiguration, RoomForwardEvent, RoomReadyMessageEvent } from '@nitrots/nitro-renderer';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useBetween } from 'use-between';
import { SendMessageComposer } from '../../api';
import { useMessageEvent } from '../events';
import { useSessionInfo } from '../session';
import { useGameCenter } from './useGameCenter';

type BattleBallPhase = 'idle' | 'queue' | 'countdown' | 'running' | 'ended';
type BattleBallConnectionState = 'idle' | 'connecting' | 'authenticating' | 'ready' | 'error' | 'closed';

interface BattleBallPlayer
{
    username: string;
    figure: string;
    isLocal?: boolean;
}

type BattleBallTeamColor = 'red' | 'green' | 'blue' | 'yellow';

interface BattleBallHudTeam
{
    team: BattleBallTeamColor;
    score: number;
}

interface BattleBallHudState
{
    timeRemaining: number;
    totalSeconds: number;
    totalTiles: number;
    tilesRemaining: number;
    teams: BattleBallHudTeam[];
}

interface BattleBallResultPlayer
{
    username: string;
    figure: string;
    team: BattleBallTeamColor | null;
    score: number;
}

interface BattleBallResultsPayload
{
    teams: BattleBallHudTeam[];
    players: BattleBallResultPlayer[];
    winnerTeam: BattleBallTeamColor | null;
    redirectRoomId: number | null;
    mvp: BattleBallResultPlayer | null;
}

const BATTLEBALL_TEAM_ORDER: BattleBallTeamColor[] = [ 'red', 'green', 'blue', 'yellow' ];

const sanitizeHudPayload = (data: any): BattleBallHudState | null =>
{
    if(!data || (typeof data !== 'object')) return null;

    const toNumber = (value: any) =>
    {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : 0;
    };

    const teams: BattleBallHudTeam[] = Array.isArray(data.teams) ? data.teams.map((entry: any) =>
    {
        const rawTeam = (typeof entry?.team === 'string') ? entry.team.toLowerCase() : '';

        if(!BATTLEBALL_TEAM_ORDER.includes(rawTeam as BattleBallTeamColor)) return null;

        return {
            team: rawTeam as BattleBallTeamColor,
            score: toNumber(entry?.score)
        };
    }).filter((team): team is BattleBallHudTeam => !!team) : [];

    return {
        timeRemaining: Math.max(0, toNumber(data.timeRemaining)),
        totalSeconds: Math.max(0, toNumber(data.totalSeconds)),
        totalTiles: Math.max(0, toNumber(data.totalTiles)),
        tilesRemaining: Math.max(0, toNumber(data.tilesRemaining)),
        teams
    };
};

const normalizeTeam = (value: any): BattleBallTeamColor | null =>
{
    if(!value || (typeof value !== 'string')) return null;

    const normalized = value.toLowerCase();
    return BATTLEBALL_TEAM_ORDER.includes(normalized as BattleBallTeamColor) ? normalized as BattleBallTeamColor : null;
};

const sanitizeResultsPayload = (data: any): BattleBallResultsPayload | null =>
{
    if(!data || (typeof data !== 'object')) return null;

    const toNumber = (value: any) =>
    {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : 0;
    };

    const teams: BattleBallHudTeam[] = Array.isArray(data.teams) ? data.teams.map((entry: any) =>
    {
        const team = normalizeTeam(entry?.team);
        if(!team) return null;

        return {
            team,
            score: toNumber(entry?.score)
        };
    }).filter((entry): entry is BattleBallHudTeam => !!entry) : [];

    const players: BattleBallResultPlayer[] = Array.isArray(data.players) ? data.players.map((entry: any) =>
    {
        const username = (typeof entry?.username === 'string') ? entry.username : '';
        if(!username) return null;

        return {
            username,
            figure: (typeof entry?.figure === 'string') ? entry.figure : '',
            team: normalizeTeam(entry?.team),
            score: toNumber(entry?.score)
        };
    }).filter((entry): entry is BattleBallResultPlayer => !!entry) : [];

    const winnerTeam = normalizeTeam(data?.winnerTeam);
    const redirectRoomId = Number.isFinite(Number(data?.redirectRoomId)) ? Number(data.redirectRoomId) : null;

    let mvp: BattleBallResultPlayer | null = null;

    if(data?.mvp)
    {
        const base = data.mvp;
        const username = (typeof base?.username === 'string') ? base.username : '';

        if(username)
        {
            mvp = {
                username,
                figure: (typeof base?.figure === 'string') ? base.figure : '',
                team: normalizeTeam(base?.team),
                score: toNumber(base?.score)
            };
        }
    }

    if(!mvp && players.length)
    {
        mvp = players[0];
    }

    if(!teams.length && !players.length && !mvp)
    {
        return null;
    }

    return {
        teams,
        players,
        winnerTeam,
        redirectRoomId,
        mvp
    };
};

enum BattleBallIncoming
{
    SSO_LOGIN = 212,
    BATTLEBALL_LEAVE = 217
}

enum BattleBallOutgoing
{
    SSO_VERIFIED = 222,
    BATTLEBALL_COUNTER = 226,
    BATTLEBALL_STARTED = 227,
    BATTLEBALL_ENDED = 228,
    BATTLEBALL_JOIN_QUEUE = 229,
    BATTLEBALL_HUD = 236
}

const useBattleBallState = () =>
{
    const { isVisible, selectedGame, setIsVisible } = useGameCenter();
    const { userInfo, userFigure } = useSessionInfo();
    const socketUrl = NitroConfiguration.getValue<string>('battleball.socket.url', null);
    const countdownDuration = NitroConfiguration.getValue<number>('battleball.countdown.seconds', 5);
    const maxPlayers = NitroConfiguration.getValue<number>('battleball.queue.maxPlayers', 12);
    const [ connectionState, setConnectionState ] = useState<BattleBallConnectionState>('idle');
    const [ phase, setPhase ] = useState<BattleBallPhase>('idle');
    const [ players, setPlayers ] = useState<BattleBallPlayer[]>([]);
    const [ countdown, setCountdown ] = useState<number>(null);
    const [ error, setError ] = useState<string>(null);
    const [ hud, setHud ] = useState<BattleBallHudState | null>(null);
    const [ results, setResults ] = useState<BattleBallResultsPayload | null>(null);
    const [ isResultsVisible, setResultsVisible ] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);
    const countdownTimerRef = useRef<number | null>(null);
    const reconnectTimerRef = useRef<number | null>(null);
    const shouldAttachRef = useRef<boolean>(false);
    const isMountedRef = useRef<boolean>(true);
    const wantsQueueRef = useRef<boolean>(false);
    const awaitingArenaForwardRef = useRef<boolean>(false);
    const arenaRoomIdRef = useRef<number | null>(null);

    const localPlayer = useMemo<BattleBallPlayer | null>(() =>
    {
        if(!userInfo) return null;

        return {
            username: userInfo.username,
            figure: userFigure || userInfo.figure,
            isLocal: true
        };
    }, [ userInfo, userFigure ]);

    const isBattleBallSelected = (selectedGame && (selectedGame.gameNameId === 'battleball'));
    const shouldDisplay = (isVisible && isBattleBallSelected);
    const isArenaFlowActive = (phase === 'queue') || (phase === 'countdown') || (phase === 'running');
    const shouldAttach = ((shouldDisplay || isArenaFlowActive) && !!socketUrl);

    const updatePlayers = useCallback((incoming: BattleBallPlayer) =>
    {
        setPlayers(prev =>
        {
            const filtered = prev.filter(player => player.username !== incoming.username);
            return [ ...filtered, incoming ];
        });
    }, []);

    const removeLocalPlayer = useCallback(() =>
    {
        if(!localPlayer?.username) return;

        setPlayers(prev => prev.filter(player => player.username !== localPlayer.username));
    }, [ localPlayer ]);

    const clearCountdown = useCallback(() =>
    {
        if(countdownTimerRef.current)
        {
            window.clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = null;
        }

        setCountdown(null);
    }, []);

    const startCountdown = useCallback((seconds: number) =>
    {
        clearCountdown();

        if(seconds <= 0) return;

        setCountdown(seconds);

        countdownTimerRef.current = window.setInterval(() =>
        {
            setCountdown(prev =>
            {
                if(prev === null) return null;

                if(prev <= 1)
                {
                    clearCountdown();
                    return 0;
                }

                return (prev - 1);
            });
        }, 1000);
    }, [ clearCountdown ]);

    const sendPayload = useCallback((header: number, data: Record<string, unknown> = {}) =>
    {
        if(!wsRef.current || (wsRef.current.readyState !== WebSocket.OPEN)) return false;

        try
        {
            wsRef.current.send(JSON.stringify({ header, data }));
            return true;
        }
        catch (err)
        {
            setError('No se pudo enviar la instrucción de BattleBall.');
            return false;
        }
    }, []);

    const disposeSocket = useCallback((notifyLeave: boolean) =>
    {
        if(reconnectTimerRef.current)
        {
            window.clearTimeout(reconnectTimerRef.current);
            reconnectTimerRef.current = null;
        }

        if(wsRef.current)
        {
            if(notifyLeave && (wsRef.current.readyState === WebSocket.OPEN))
            {
                try { wsRef.current.send(JSON.stringify({ header: BattleBallIncoming.BATTLEBALL_LEAVE, data: {} })); }
                catch (err) { /* ignored */ }
            }

            wsRef.current.close();
            wsRef.current = null;
        }

        clearCountdown();
        setConnectionState('idle');
        setHud(null);
        awaitingArenaForwardRef.current = false;
        arenaRoomIdRef.current = null;
    }, [ clearCountdown ]);

    const dismissResults = useCallback(() =>
    {
        setResultsVisible(false);
        window.setTimeout(() => setResults(null), 300);
    }, []);

    const handleSocketMessage = useCallback((event: MessageEvent<string>) =>
    {
        if(!isMountedRef.current) return;

        try
        {
            const packet = JSON.parse(event.data);

            switch(packet.header)
            {
                case BattleBallOutgoing.SSO_VERIFIED:
                    if(packet.data?.authenticated)
                    {
                        setConnectionState('ready');
                        setError(null);
                    }
                    else
                    {
                        setConnectionState('error');
                        setError('El servidor rechazó el SSO.');
                    }
                    break;
                case BattleBallOutgoing.BATTLEBALL_JOIN_QUEUE:
                    if(packet.data?.username)
                    {
                        const isLocal = (localPlayer?.username === packet.data.username);
                        updatePlayers({ username: packet.data.username, figure: packet.data.figure || '', isLocal });
                        if(isLocal) wantsQueueRef.current = true;
                    }

                    setPhase(prev => (prev === 'idle' ? 'queue' : prev));
                    break;
                case BattleBallOutgoing.BATTLEBALL_COUNTER:
                    setPhase('countdown');
                    startCountdown(countdownDuration);
                    break;
                case BattleBallOutgoing.BATTLEBALL_STARTED:
                    setPhase('running');
                    clearCountdown();
                    awaitingArenaForwardRef.current = true;
                    break;
                case BattleBallOutgoing.BATTLEBALL_ENDED:
                    setPhase('ended');
                    clearCountdown();
                    awaitingArenaForwardRef.current = false;
                    const summary = sanitizeResultsPayload(packet.data);
                    setResults(summary);
                    setResultsVisible(!!summary);
                    setHud(null);
                    window.setTimeout(() => isMountedRef.current && setPlayers([]), 1500);
                    break;
                case BattleBallOutgoing.BATTLEBALL_HUD: {
                    const parsedHud = sanitizeHudPayload(packet.data);
                    if(parsedHud) setHud(parsedHud);
                    break;
                }
                default:
                    break;
            }
        }
        catch (err)
        {
            setError('Respuesta desconocida del servidor de BattleBall.');
        }
    }, [ clearCountdown, countdownDuration, localPlayer, startCountdown, updatePlayers ]);

    const connect = useCallback(() =>
    {
        if(wsRef.current || !shouldAttachRef.current) return;

        if(!socketUrl)
        {
            setConnectionState('error');
            setError('Falta battleball.socket.url en ui-config.json');
            return;
        }

        try
        {
            setConnectionState('connecting');
            setError(null);

            const socket = new WebSocket(socketUrl);
            wsRef.current = socket;

            socket.onopen = () =>
            {
                if(!isMountedRef.current) return;

                setConnectionState('authenticating');

                const ticket = NitroConfiguration.getValue<string>('sso.ticket', null);

                if(!ticket)
                {
                    setConnectionState('error');
                    setError('No hay SSO disponible para BattleBall.');
                    return;
                }

                sendPayload(BattleBallIncoming.SSO_LOGIN, { auth_ticket: ticket });
            };

            socket.onmessage = handleSocketMessage;

            socket.onerror = () =>
            {
                if(!isMountedRef.current) return;

                setConnectionState('error');
                setError('No se pudo comunicar con el servidor de BattleBall.');
            };

            socket.onclose = () =>
            {
                wsRef.current = null;

                if(!isMountedRef.current) return;

                setConnectionState('closed');
                clearCountdown();

                if(shouldAttachRef.current)
                {
                    reconnectTimerRef.current = window.setTimeout(() =>
                    {
                        reconnectTimerRef.current = null;
                        if(shouldAttachRef.current) connect();
                    }, 1500);
                }
            };
        }
        catch (err)
        {
            setConnectionState('error');
            setError('No se pudo abrir el socket de BattleBall.');
        }
    }, [ clearCountdown, handleSocketMessage, sendPayload, socketUrl ]);

    const joinBattleBallQueue = useCallback(() =>
    {
        if(!selectedGame || (selectedGame.gameNameId !== 'battleball')) return;

        shouldAttachRef.current = true;

        if(!wsRef.current) connect();

        if(localPlayer)
        {
            updatePlayers(localPlayer);
        }

        setResults(null);
        setResultsVisible(false);
        wantsQueueRef.current = true;
        setPhase(prev => (prev === 'running' ? prev : 'queue'));
        SendMessageComposer(new JoinQueueMessageComposer(selectedGame.gameId));
    }, [ connect, localPlayer, selectedGame, updatePlayers ]);

    const leaveBattleBallQueue = useCallback(() =>
    {
        wantsQueueRef.current = false;
        awaitingArenaForwardRef.current = false;
        arenaRoomIdRef.current = null;
        sendPayload(BattleBallIncoming.BATTLEBALL_LEAVE, {});
        removeLocalPlayer();
        setPhase('idle');
        setHud(null);
    }, [ removeLocalPlayer, sendPayload ]);

    useEffect(() =>
    {
        shouldAttachRef.current = shouldAttach;

        if(!shouldAttach)
        {
            wantsQueueRef.current = false;
            disposeSocket(true);
            setPlayers([]);
            setPhase('idle');
            setHud(null);

            if(!shouldDisplay) setError(null);
            return;
        }

        connect();
    }, [ connect, disposeSocket, shouldAttach, shouldDisplay ]);

    const handleRoomTeleport = useCallback((roomId: number | null, source: 'forward' | 'ready') =>
    {
        const normalizedRoomId = (roomId && (roomId > 0)) ? roomId : null;
        const isArenaKnown = (arenaRoomIdRef.current !== null);
        const isArenaPing = (isArenaKnown && (normalizedRoomId === arenaRoomIdRef.current));
        const hasBattleBallContext = awaitingArenaForwardRef.current || wantsQueueRef.current || isArenaKnown || (phase !== 'idle');

        if(!hasBattleBallContext)
        {
            return;
        }

        const shouldAttachToArena = (source === 'forward') && (!isArenaKnown) && (awaitingArenaForwardRef.current || wantsQueueRef.current || (phase === 'queue') || (phase === 'countdown') || (phase === 'running'));

        if(shouldAttachToArena)
        {
            awaitingArenaForwardRef.current = false;
            wantsQueueRef.current = false;
            arenaRoomIdRef.current = normalizedRoomId;
            setIsVisible(false);
            setPhase(prev => (prev === 'running') ? prev : 'running');
            return;
        }

        if(source === 'ready' && isArenaPing)
        {
            return;
        }

        if(isArenaPing)
        {
            return;
        }

        arenaRoomIdRef.current = null;
        awaitingArenaForwardRef.current = false;
        wantsQueueRef.current = false;
        clearCountdown();
        disposeSocket(false);
        setPlayers([]);
        setPhase('idle');
        setHud(null);
        setIsVisible(false);
    }, [ clearCountdown, disposeSocket, phase, setHud, setIsVisible, setPhase, setPlayers ]);

    useMessageEvent<RoomForwardEvent>(RoomForwardEvent, event =>
    {
        const parser = event.getParser();
        handleRoomTeleport(parser?.roomId ?? null, 'forward');
    });

    useMessageEvent<RoomReadyMessageEvent>(RoomReadyMessageEvent, event =>
    {
        const parser = event.getParser();
        handleRoomTeleport(parser?.roomId ?? null, 'ready');
    });

    useEffect(() =>
    {
        return () =>
        {
            isMountedRef.current = false;
            disposeSocket(true);
        };
    }, [ disposeSocket ]);

    return {
        showStage: shouldDisplay,
        connectionState,
        phase,
        players,
        countdown,
        error,
        maxPlayers,
        hud,
        results,
        isResultsVisible,
        joinBattleBallQueue,
        leaveBattleBallQueue,
        dismissResults,
        reconnect: connect,
        isBattleBallSelected,
        isSocketConfigured: !!socketUrl
    };
}

export const useBattleBall = () => useBetween(useBattleBallState);
