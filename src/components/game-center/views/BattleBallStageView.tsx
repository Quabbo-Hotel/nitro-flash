import { FC, useMemo } from 'react';
import { Base, Button, Flex, LayoutAvatarImageView, Text } from '../../../common';
import { useBattleBall } from '../../../hooks';

const connectionCopy: Record<string, string> = {
    idle: 'En espera',
    connecting: 'Conectando…',
    authenticating: 'Validando acceso…',
    ready: 'Listo',
    error: 'Error de enlace',
    closed: 'Desconectado'
};

const phaseCopy: Record<string, string> = {
    idle: 'Esperando jugadores',
    queue: 'En cola',
    countdown: 'Comienza la partida',
    running: 'Partida en curso',
    ended: 'Partida finalizada'
};

export const BattleBallStageView: FC = () =>
{
    const { showStage, connectionState, phase, countdown, players, error, maxPlayers, leaveBattleBallQueue, reconnect, isSocketConfigured } = useBattleBall();

    const highlight = useMemo(() =>
    {
        if(error) return error;
        if(!isSocketConfigured) return 'Configura battleball.socket.url para activar la arena.';

        switch(phase)
        {
            case 'countdown':
                return countdown ? `La arena abre en ${ countdown }s.` : 'La arena abre en instantes.';
            case 'running':
                return 'La partida está en curso, espera tu turno.';
            case 'ended':
                return 'Ronda terminada, preparando la siguiente.';
            case 'queue':
                return 'Te enviaremos al mapa apenas haya cupo.';
            default:
                return 'Conéctate a la cola para reclamar tu lugar.';
        }
    }, [ countdown, error, isSocketConfigured, phase ]);

    if(!showStage) return null;

    return (
        <Flex column className="battleball-stage" gap={ 2 }>
            <Flex justifyContent="between" alignItems="center">
                <div>
                    <Text bold fontSize={ 5 }>BattleBall Control Room</Text>
                    <Text className="battleball-stage__subtitle">Coordina la cola, observa el estado de la arena y controla tu sesión.</Text>
                </div>
                <div className={ `battleball-stage__chip battleball-stage__chip--${ connectionState }` }>
                    { connectionCopy[connectionState] || connectionState }
                </div>
            </Flex>

            <Flex className="battleball-stage__summary" alignItems="center" justifyContent="between">
                <div>
                    <Text bold className="battleball-stage__summary-title">Estado</Text>
                    <Text>{ phaseCopy[phase] || phase }</Text>
                </div>
                <div>
                    <Text bold className="battleball-stage__summary-title">Cola</Text>
                    <Text>{ players.length } / { maxPlayers }</Text>
                </div>
                <div>
                    <Text bold className="battleball-stage__summary-title">Arena</Text>
                    <Text>{ highlight }</Text>
                </div>
            </Flex>

            <Flex column className="battleball-stage__players" gap={ 1 }>
                <Text bold>Jugadores en espera</Text>
                <Flex gap={ 1 } className="battleball-stage__player-grid">
                    { players.length ? players.map(player =>
                        <Flex key={ player.username } alignItems="center" className="battleball-stage__player" gap={ 1 }>
                            <LayoutAvatarImageView figure={ player.figure } direction={ 2 } headOnly={ true } />
                            <div>
                                <Text bold>{ player.username }</Text>
                                <Text className="battleball-stage__player-role">{ player.isLocal ? 'Tú' : 'En cola' }</Text>
                            </div>
                        </Flex>
                    ) :
                        <Base className="battleball-stage__empty">
                            <Text>Nadie en cola todavía. ¡Sé el primero!</Text>
                        </Base>
                    }
                </Flex>
            </Flex>

            <Flex justifyContent="end" gap={ 1 }>
                <Button disabled={ (phase === 'idle') } variant="dark" onClick={ leaveBattleBallQueue }>
                    Salir de la cola
                </Button>
                <Button variant="light" disabled={ !isSocketConfigured } onClick={ reconnect }>
                    Reintentar enlace
                </Button>
            </Flex>
        </Flex>
    );
};
