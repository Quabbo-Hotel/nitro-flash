import { Game2GetAccountGameStatusMessageComposer, GetGameStatusMessageComposer, JoinQueueMessageComposer } from '@nitrots/nitro-renderer';
import { useEffect } from 'react';
import { ColorUtils, LocalizeText, SendMessageComposer } from '../../../api';
import { Base, Button, Flex, LayoutItemCountView, Text } from '../../../common';
import { useBattleBall, useGameCenter } from '../../../hooks';

const connectionStateCopy: Record<string, string> = {
    idle: 'Conecta para unirte',
    connecting: 'Conectando…',
    authenticating: 'Validando…',
    ready: 'Listo',
    error: 'Error al conectar',
    closed: 'Desconectado'
};

export const GameView = () => 
{
    const { selectedGame, accountStatus } = useGameCenter();
    const { joinBattleBallQueue, connectionState: battleConnectionState, phase: battlePhase, players: battlePlayers, maxPlayers: battleMaxPlayers } = useBattleBall();
    const isBattleBallGame = (selectedGame && (selectedGame.gameNameId === 'battleball'));
    const canPlayCurrentGame = (!accountStatus || accountStatus.hasUnlimitedGames || (accountStatus.freeGamesLeft > 0));
    const remainingGameTokens = (!accountStatus || accountStatus.hasUnlimitedGames) ? null : accountStatus.freeGamesLeft;

    useEffect(()=>
    {
        if(selectedGame) 
        {
            SendMessageComposer(new GetGameStatusMessageComposer(selectedGame.gameId));
            SendMessageComposer(new Game2GetAccountGameStatusMessageComposer(selectedGame.gameId));
        }
    },[ selectedGame ])

    const getBgColour = (): string => 
    {
        return ColorUtils.uintHexColor(selectedGame.bgColor)
    }

    const getBgImage = (): string => 
    {
        return `url(${ selectedGame.assetUrl }${ selectedGame.gameNameId }_theme.png)`
    }

    const getColor = () => 
    {
        return ColorUtils.uintHexColor(selectedGame.textColor);
    }

    const onPlay = () => 
    {
        if(isBattleBallGame)
        {
            joinBattleBallQueue();
            return;
        }

        SendMessageComposer(new JoinQueueMessageComposer(selectedGame.gameId));
    }

    const getBattleBallCta = () =>
    {
        if(!isBattleBallGame) return LocalizeText('gamecenter.play_now');

        if(battlePhase === 'queue') return 'En cola…';
        if(battlePhase === 'countdown') return 'Preparando arena';

        return 'Unirme a la cola';
    }

    return <Flex className="game-view py-4" fullHeight style={ { backgroundColor: getBgColour(), backgroundImage: getBgImage(), color: getColor() } }>
        <Flex className="w-75" column alignItems="center" gap={ 2 }>
            <Text bold>{ LocalizeText(`gamecenter.${ selectedGame.gameNameId }.description_title`) }</Text>
            <img src={ selectedGame.assetUrl + selectedGame.gameNameId + '_logo.png' }/>
            { canPlayCurrentGame && <>
                <Button variant="light" position="relative" className="px-4" onClick={ onPlay }>
                    { getBattleBallCta() }
                    { (remainingGameTokens !== null) &&
                    <LayoutItemCountView className="me-n1 mt-n1" count={ remainingGameTokens }/> }
                </Button>
            </> }
            { isBattleBallGame &&
                <Text className="battleball-status-pill">
                    { battleConnectionState === 'ready' ? `Cola: ${ battlePlayers.length } / ${ battleMaxPlayers }` : (connectionStateCopy[battleConnectionState] || connectionStateCopy.idle) }
                </Text> }
            <Text bold className="w-50" center>{ LocalizeText(`gamecenter.${ selectedGame.gameNameId }.description_content`) }</Text>
        </Flex>
        <Base className="w-25">

        </Base>
        
    </Flex>
}
