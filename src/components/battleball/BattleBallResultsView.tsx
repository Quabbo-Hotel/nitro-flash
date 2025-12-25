import { FC, useMemo } from 'react';
import { Base, Button, Flex, LayoutAvatarImageView, Text } from '../../common';
import { useBattleBall } from '../../hooks';
import './BattleBallResultsView.scss';

type TeamKey = 'red' | 'green' | 'blue' | 'yellow';

const TEAM_META: Record<TeamKey, { label: string; accent: string }> = {
    red: { label: 'Equipo Rojo', accent: '#ff5f6d' },
    blue: { label: 'Equipo Azul', accent: '#4bb7ff' },
    green: { label: 'Equipo Verde', accent: '#6dd783' },
    yellow: { label: 'Equipo Amarillo', accent: '#ffd056' }
};

const TEAM_ORDER: TeamKey[] = [ 'red', 'green', 'blue', 'yellow' ];

export const BattleBallResultsView: FC = () =>
{
    const { results, isResultsVisible, dismissResults } = useBattleBall();

    const orderedPlayers = useMemo(() =>
    {
        if(!results?.players?.length) return [];

        return [ ...results.players ].sort((a, b) => b.score - a.score);
    }, [ results ]);

    if(!isResultsVisible || !results) return null;

    const redirectRoomId = results.redirectRoomId ?? 64;
    const winnerLabel = results.winnerTeam ? TEAM_META[results.winnerTeam]?.label : null;

    return (
        <div className="battleball-results">
            <Flex column gap={ 2 } className="battleball-results__panel">
                <Flex justifyContent="between" alignItems="center">
                    <div>
                        <Text bold fontSize={ 5 }>Resultados de BattleBall</Text>
                        <Text className="battleball-results__subtitle">
                            { winnerLabel ? `Victoria del ${ winnerLabel }` : 'Partida finalizada' } · Traslado a la sala #{ redirectRoomId }
                        </Text>
                    </div>
                    <Button variant="light" onClick={ dismissResults }>Cerrar</Button>
                </Flex>

                { results.mvp && (
                    <Flex className="battleball-results__mvp" gap={ 1.25 } alignItems="center">
                        <LayoutAvatarImageView figure={ results.mvp.figure } direction={ 2 } headOnly />
                        <div>
                            <Text className="battleball-results__mvp-label">Jugador destacado</Text>
                            <Text bold fontSize={ 4 }>{ results.mvp.username }</Text>
                            <Text className="battleball-results__mvp-score">{ results.mvp.score } pts</Text>
                        </div>
                    </Flex>
                ) }

                <Flex className="battleball-results__teams" gap={ 1 }>
                    { TEAM_ORDER.map(team =>
                    {
                        const entry = results.teams.find(resultEntry => resultEntry.team === team);
                        const meta = TEAM_META[team];
                        const isWinner = (results.winnerTeam === team);

                        return (
                            <Base key={ team } className={`battleball-results__team ${ isWinner ? 'is-winner' : '' }`}>
                                <span className="battleball-results__team-label">{ meta.label }</span>
                                <span className="battleball-results__team-score">{ entry?.score ?? 0 } pts</span>
                            </Base>
                        );
                    }) }
                </Flex>

                <div className="battleball-results__players">
                    { orderedPlayers.length ? orderedPlayers.map(player =>
                        {
                            const meta = player.team ? TEAM_META[player.team] : null;

                            return (
                                <Flex key={`${ player.username }-${ player.team ?? 'none' }`} className="battleball-results__player" justifyContent="between" alignItems="center">
                                    <Flex alignItems="center" gap={ 1 }>
                                        <LayoutAvatarImageView figure={ player.figure } direction={ 2 } headOnly />
                                        <div>
                                            <Text bold>{ player.username }</Text>
                                            <Text className="battleball-results__player-team">{ meta ? meta.label : 'Sin equipo' }</Text>
                                        </div>
                                    </Flex>
                                    <Text bold>{ player.score } pts</Text>
                                </Flex>
                            );
                        }) : <Text className="battleball-results__empty">No se registraron puntuaciones individuales.</Text> }
                </div>
            </Flex>
        </div>
    );
};
