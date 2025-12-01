import { FC, useEffect, useState } from 'react';
import { WiredFurniType } from '../../../../api';
import { Column, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionTimerControlView: FC<{}> = props =>
{
    const [ mode, setMode ] = useState(0);
    const { trigger = null, setIntParams = null } = useWired();

    const save = () =>
    {
        setIntParams([ mode ]);
    }

    useEffect(() =>
    {
        if(trigger?.intData?.length >= 1)
        {
            setMode(trigger.intData[0]);
        }
        else
        {
            setMode(0); 
        }
    }, [ trigger ]);

    return (
        <WiredActionBaseView
            requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_BY_ID_BY_TYPE_OR_FROM_CONTEXT }
            hasSpecialInput={ true }
            save={ save }
        >
            <Text>{'Selecciona el modo del temporizador:'}</Text>
            <Column gap={ 1 }>
                <label>
                    <input
                        type="radio"
                        name="timerMode"
                        value={0}
                        checked={mode === 0}
                        onChange={() => setMode(0)}
                    />
                    Comenzar
                </label>
                <label>
                    <input
                        type="radio"
                        name="timerMode"
                        value={1}
                        checked={mode === 1}
                        onChange={() => setMode(1)}
                    />
                    Parar
                </label>
                <label>
                    <input
                        type="radio"
                        name="timerMode"
                        value={3}
                        checked={mode === 3}
                        onChange={() => setMode(3)}
                    />
                    Reiniciar
                </label>
            </Column>
        </WiredActionBaseView>
    );
}
