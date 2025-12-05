import { FC, useEffect, useState } from 'react';
import { Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredAddonBaseView } from './WiredAddonBaseView';

export const WiredAddonContextVariableView: FC = () => {
    const { trigger = null, setIntParams = null, setStringParam = null } = useWired();
    const [varName, setVarName] = useState('');
    const [hasValue, setHasValue] = useState(false);

    useEffect(() => {
        if(!trigger) return;
        setVarName(trigger.stringData || '');
        const storedHasValue = trigger.intData.length > 0 ? trigger.intData[0] === 1 : false;
        setHasValue(storedHasValue);
    }, [ trigger?.id ]);

    const save = () => {
        setStringParam?.(varName.trim());
        setIntParams?.([ hasValue ? 1 : 0 ]);
    };

    return (
        <WiredAddonBaseView hasSpecialInput save={ save } requiresFurni={ 0 }>
            <Column gap={ 1 }>
                <Text bold>Nombre de la variable de contexto</Text>
                <input
                    type='text'
                    className='form-control form-control-sm'
                    maxLength={ 64 }
                    value={ varName }
                    onChange={ event => setVarName(event.target.value) }
                    placeholder='Ej. ronda_actual'
                />

                <Text bold>Opciones</Text>
                <Flex gap={ 1 } alignItems='center'>
                    <input
                        className='form-check-input'
                        type='checkbox'
                        checked={ hasValue }
                        onChange={ event => setHasValue(event.target.checked) }
                    />
                    <Text small>Permite almacenar un valor numérico</Text>
                </Flex>

                <Text small variant='muted'>
                    Las variables de contexto solo se usan dentro de Wired y se listan en el monitor. No se vinculan a furnis ni usuarios.
                </Text>
            </Column>
        </WiredAddonBaseView>
    );
};
