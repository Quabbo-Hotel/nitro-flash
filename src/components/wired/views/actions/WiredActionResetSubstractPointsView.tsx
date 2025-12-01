import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Column, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredResetSubstractPointsView: FC<{}> = () => {
    const [ actionType, setActionType ] = useState(0); // 0 = Añadir, 1 = Setear
    const [ points, setPoints ] = useState('');
    const { trigger = null, setIntParams = null, setStringParam = null } = useWired();

    const save = () => {
        setIntParams([ actionType ]);

        if(actionType === 0) { // Solo guardar puntos si es "Añadir"
            setStringParam(points);
        } else {
            setStringParam('');
        }
    }

    useEffect(() => {
        if(trigger) {
            if(trigger.intData?.length >= 1) setActionType(trigger.intData[0]);
            if(trigger.stringData) setPoints(trigger.stringData);
        }
    }, [ trigger ]);

    return (
        <WiredActionBaseView
            requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE }
            hasSpecialInput={ true }
            save={ save }
        >
            <Column gap={1}>
                <label>
                    <input
                        type="radio"
                        name="actionType"
                        value={0}
                        checked={actionType === 0}
                        onChange={() => setActionType(0)}
                    />
                    { LocalizeText('wired.action.reset_points') }
                </label>
                <label>
                    <input
                        type="radio"
                        name="actionType"
                        value={1}
                        checked={actionType === 1}
                        onChange={() => setActionType(1)}
                    />
                    { LocalizeText('wired.action.substract_points') }
                </label>
            </Column>

            { actionType === 0 && (  // Cambiado a 0 para "Añadir puntos"
                <Column gap={1}>
                    <Text gfbold>{ LocalizeText('wiredfurni.params.points') }</Text>
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        value={points}
                        onChange={event => setPoints(event.target.value)}
                        maxLength={6}
                    />
                </Column>
            )}
        </WiredActionBaseView>
    );
}
