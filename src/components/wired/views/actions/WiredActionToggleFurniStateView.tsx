import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionToggleFurniStateView: FC<{}> = props =>
{
    const [ mode, setMode ] = useState(0);
    const [ specificState, setSpecificState ] = useState(0);
    const { trigger = null, setIntParams = null } = useWired();

    const save = () =>
    {
        if (mode === 3) {
            setIntParams([ mode, specificState ]);
        } else {
            setIntParams([ mode ]);
        }
    }

    useEffect(() =>
    {
        if(trigger?.intData?.length >= 1)
        {
            setMode(trigger.intData[0]);
            if (trigger.intData.length >= 2) {
                setSpecificState(trigger.intData[1]);
            } else {
                setSpecificState(0);
            }
        }
        else
        {
            setMode(0);
            setSpecificState(0);
        }
    }, [ trigger ]);

    return (
        <WiredActionBaseView
            requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_BY_ID_BY_TYPE_OR_FROM_CONTEXT }
            hasSpecialInput={ true }
            save={ save }
        >
            <Column gap={ 1 }>
                <Text className='goldfish-bold'>{ LocalizeText('wiredfurni.params.togglefurnistate.mode', [''], ['']) }</Text>

                <Flex gap={ 1 }>
                    <input
                        className="form-check-input"
                        type="radio"
                        id="modeNormal"
                        checked={ mode === 0 }
                        onChange={() => setMode(0)}
                    />
                    <label className="form-check-label" htmlFor="modeNormal">
                        Normal
                    </label>
                </Flex>

                <Flex gap={ 1 }>
                    <input
                        className="form-check-input"
                        type="radio"
                        id="modeInverse"
                        checked={ mode === 1 }
                        onChange={() => setMode(1)}
                    />
                    <label className="form-check-label" htmlFor="modeInverse">
                        Inverso
                    </label>
                </Flex>

                <Flex gap={ 1 }>
                    <input
                        className="form-check-input"
                        type="radio"
                        id="modeRandom"
                        checked={ mode === 2 }
                        onChange={() => setMode(2)}
                    />
                    <label className="form-check-label" htmlFor="modeRandom">
                        Aleatorio
                    </label>
                </Flex>

                <Flex gap={ 1 }>
                    <input
                        className="form-check-input"
                        type="radio"
                        id="modeSpecific"
                        checked={ mode === 3 }
                        onChange={() => setMode(3)}
                    />
                    <label className="form-check-label" htmlFor="modeSpecific">
                        Estado específico
                    </label>
                </Flex>

                {mode === 3 && (
                    <Flex gap={ 1 }>
                        <label htmlFor="specificState">Estado:</label>
                        <input
                            type="number"
                            id="specificState"
                            value={specificState}
                            onChange={(e) => setSpecificState(parseInt(e.target.value) || 0)}
                            min="0"
                            step="1"
                            maxLength={2}
                        />
                    </Flex>
                )}
            </Column>
        </WiredActionBaseView>
    );
}
