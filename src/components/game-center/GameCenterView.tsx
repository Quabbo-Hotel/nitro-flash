import { ILinkEventTracker } from '@nitrots/nitro-renderer';
import { useEffect } from 'react';
import { AddEventLinkTracker, RemoveLinkEventTracker } from '../../api';
import { Button, Flex, Text } from '../../common';
import { useGameCenter } from '../../hooks';
import { GameListView } from './views/GameListView';
import { GameStageView } from './views/GameStageView';
import { GameView } from './views/GameView';
import { BattleBallStageView } from './views/BattleBallStageView';

export const GameCenterView = () => 
{
    const { isVisible, setIsVisible, games, selectedGame } = useGameCenter();
    const isBattleBallSelected = (selectedGame && (selectedGame.gameNameId === 'battleball'));
    const hasGameData = !!(games && games.length && selectedGame);

    useEffect(() =>
    {
        const toggleGameCenter = () =>
        {
            setIsVisible(prev => !prev);
        }

        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const value = url.split('/');
                
                switch(value[1]) 
                {
                    case 'toggle':
                        toggleGameCenter();
                        break;
                }
            },
            eventUrlPrefix: 'games/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [ ]);

    if(!isVisible) return null;

    return <Flex position="absolute" className="game-center-wrapper" column gap={ 1.25 }>
        <Flex alignItems="center" justifyContent="between" className="game-center-head">
            <Text bold fontSize={ 4 }>Game Center</Text>
            <Button variant="dark" onClick={ () => setIsVisible(false) }>Cerrar</Button>
        </Flex>

        { !hasGameData &&
            <Flex className="game-center-placeholder" column alignItems="center" gap={ 1.5 }>
                <Text bold fontSize={ 5 }>Cargando Game Center…</Text>
                <Text className="game-center-placeholder__copy">
                    Solicitamos la lista de juegos al servidor. Si esto tarda demasiado, revisa la tabla gamecenter_list y usa el comando reload gamecenter.
                </Text>
            </Flex> }

        { hasGameData &&
            <Flex className="game-center-body" gap={ 1.5 } alignItems="stretch" justifyContent="center">
                <Flex className="game-center-main" column>
                    <GameView/>
                    <GameListView />
                </Flex>
                { isBattleBallSelected ? <BattleBallStageView /> : <GameStageView /> }
            </Flex> }
    </Flex>
}
