import { FC, useMemo } from 'react';
import { Flex, Text } from '../../common';
import { useBattleBall } from '../../hooks';

const TEAM_META: Record<string, { label: string; accent: string }> = {
    red: { label: 'Equipo Rojo', accent: '#ff5f6d' },
    blue: { label: 'Equipo Azul', accent: '#4bb7ff' },
    green: { label: 'Equipo Verde', accent: '#6dd783' },
    yellow: { label: 'Equipo Amarillo', accent: '#ffd056' }
};

const TEAM_ORDER = [ 'red', 'green', 'blue', 'yellow' ];

const formatTimer = (seconds: number) =>
{
    const safeSeconds = Math.max(0, Math.floor(seconds));
    const minutes = Math.floor(safeSeconds / 60);
    const remainder = safeSeconds % 60;
    return `${ minutes.toString().padStart(2, '0') }:${ remainder.toString().padStart(2, '0') }`;
};

export const BattleBallHudView: FC = () =>
{
    const { phase, hud } = useBattleBall();
    const showHud = (phase === 'running');
    const hasLiveHud = !!hud;
    const totalTiles = Math.max(0, hud?.totalTiles ?? 0);
    const tilesRemaining = Math.max(0, hud?.tilesRemaining ?? totalTiles);
    const capturedTiles = Math.max(0, (totalTiles - tilesRemaining));
    const timeRemaining = Math.max(0, hud?.timeRemaining ?? 0);

    const progress = useMemo(() =>
    {
        const teams = hud?.teams ?? [];
        const total = Math.max(0, hud?.totalTiles ?? 0);

        return TEAM_ORDER.map(team =>
        {
            const details = TEAM_META[team];
            const teamState = teams.find(entry => entry.team === team);
            const score = Math.max(0, teamState?.score ?? 0);
            const percent = total > 0 ? Math.min(100, (score / total) * 100) : 0;

            return {
                team,
                score,
                percent,
                label: details?.label || team,
                accent: details?.accent || '#ffffff'
            };
        });
    }, [ hud ]);

    const leadingScore = useMemo(() =>
    {
        if(!progress.length) return 0;
        return Math.max(...progress.map(entry => entry.score));
    }, [ progress ]);

    if(!showHud) return null;

    return (
        <Flex column className="battleball-hud" gap={ 1 }>
            <Flex className="battleball-hud__header" justifyContent="between" alignItems="center">
                <div>
                    <Text bold fontSize={ 4 }>BattleBall Arena</Text>
                    <Text className="battleball-hud__subtitle">Captura casillas y domina el mapa.</Text>
                </div>
                <span className="battleball-hud__timer">{ formatTimer(timeRemaining) }</span>
            </Flex>

            <Flex column gap={ 1 }>
                { progress.map(entry =>
                    <div key={ entry.team } className={`battleball-hud__bar battleball-hud__bar--${ entry.team } ${ (entry.score > 0 && entry.score === leadingScore) ? 'is-leading' : '' }`}>
                        <Flex justifyContent="between" alignItems="center" className="battleball-hud__bar-head">
                            <span>{ entry.label }</span>
                            <span>{ entry.score } casillas</span>
                        </Flex>
                        <div className="battleball-hud__bar-track">
                            <div className="battleball-hud__bar-fill" style={{ width: `${ entry.percent }%`, background: entry.accent }} />
                        </div>
                    </div>
                ) }
            </Flex>

            { !hasLiveHud &&
                <Flex className="battleball-hud__placeholder" justifyContent="center">
                    <Text>Sin telemetría en vivo, esperando actualización del servidor…</Text>
                </Flex> }

            <Flex className="battleball-hud__footer" justifyContent="between">
                <Text>Ocupadas { capturedTiles } / { totalTiles }</Text>
                <Text>Libres { tilesRemaining }</Text>
            </Flex>
        </Flex>
    );
};
