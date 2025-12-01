import { FC, useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
import { WiredFurniType } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredTriggerBaseView } from './WiredTriggerBaseView';

export const WiredTriggerCommandExecView: FC<{}> = props =>
{
    const [username, setUsername] = useState('');
    const [userMode, setUserMode] = useState(0); // 0: any user, 1: specific user
    const { trigger = null, setStringParam = null, setIntParams = null } = useWired();
    const [actionTarget, setActionTarget] = useState(0); // 0: selected player, 1: executor
    const [distanceMode, setDistanceMode] = useState(0); // 0: any distance, 1: specific distance
    const [distance, setDistance] = useState(1); // distance value for slider
    const [command, setCommand] = useState('');

    const save = () =>
    {
        setIntParams([userMode, actionTarget, distanceMode, distance]);
        setStringParam(userMode === 1 ? `${command}|${username}` : command);
    };

    useEffect(() =>
    {
        const data = trigger.intData;
        const stringData = trigger.stringData || '';
        
        // Set values from saved data
        const savedUserMode = data.length > 0 ? data[0] : 0;
        setUserMode(savedUserMode);
        setActionTarget(data.length > 1 ? data[1] : 0);
        setDistanceMode(data.length > 2 ? data[2] : 0);
        setDistance(data.length > 3 ? data[3] : 1);
        
        // Parse command and username from string data based on saved user mode
        if (savedUserMode === 1 && stringData.includes('|')) {
            const [cmd, user] = stringData.split('|');
            setCommand(cmd);
            setUsername(user);
        } else {
            setCommand(stringData);
            setUsername('');
        }
    }, [trigger]);

    return (
        <WiredTriggerBaseView requiresFurni={WiredFurniType.STUFF_SELECTION_OPTION_NONE} hasSpecialInput={true} save={save}>
            <Column gap={1}>
                <Text gfbold>Comando (ej: :teleport)</Text>
                <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder=":teleport"
                    value={command}
                    onChange={event => setCommand(event.target.value)}
                />
            </Column>
            <hr className="m-0 bg-dark" />

            <Column gap={1}>
                <Text bold>¿Quién puede activar el wired?</Text>

                <Flex alignItems="center" gap={1}>
                    <input
                        className="form-check-input"
                        type="radio"
                        name="userMode"
                        id="userMode0"
                        checked={userMode === 0}
                        onChange={() => setUserMode(0)} />
                    <Text>Cualquier usuario</Text>
                </Flex>

                <Flex alignItems="center" gap={1}>
                    <input
                        className="form-check-input"
                        type="radio"
                        name="userMode"
                        id="userMode1"
                        checked={userMode === 1}
                        onChange={() => setUserMode(1)} />
                    <Text>Usuario específico</Text>
                </Flex>

                {userMode === 1 &&
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Nombre de usuario"
                        value={username}
                        onChange={event => setUsername(event.target.value)} />}
            </Column>
            <hr className="m-0 bg-dark" />
            
            <Column gap={1}>
                <Text bold>¿A quién se aplica la acción?</Text>
                
                <Flex alignItems="center" gap={1}>
                    <input
                        className="form-check-input"
                        type="radio"
                        name="actionTarget"
                        id="actionTarget0"
                        checked={actionTarget === 0}
                        onChange={() => setActionTarget(0)} />
                    <Text>Jugador seleccionado</Text>
                </Flex>

                <Flex alignItems="center" gap={1}>
                    <input
                        className="form-check-input"
                        type="radio"
                        name="actionTarget"
                        id="actionTarget1"
                        checked={actionTarget === 1}
                        onChange={() => setActionTarget(1)} />
                    <Text>Ejecutor del comando</Text>
                </Flex>
            </Column>
            <hr className="m-0 bg-dark" />
            
            <Column gap={1}>
                <Text bold>Distancia de ejecución</Text>
                
                <Flex alignItems="center" gap={1}>
                    <input
                        className="form-check-input"
                        type="radio"
                        name="distanceMode"
                        id="distanceMode0"
                        checked={distanceMode === 0}
                        onChange={() => setDistanceMode(0)} />
                    <Text>Cualquier distancia</Text>
                </Flex>

                <Flex alignItems="center" gap={1}>
                    <input
                        className="form-check-input"
                        type="radio"
                        name="distanceMode"
                        id="distanceMode1"
                        checked={distanceMode === 1}
                        onChange={() => setDistanceMode(1)} />
                    <Text>Distancia específica</Text>
                </Flex>

                {distanceMode === 1 &&
                    <Column gap={1}>
                        <Text>{`Distancia: ${distance} casillas`}</Text>
                        <ReactSlider
                            className={'nitro-slider'}
                            min={1}
                            max={20}
                            value={distance}
                            onChange={event => setDistance(event)} />
                    </Column>}
            </Column>

        </WiredTriggerBaseView>
    );
};
