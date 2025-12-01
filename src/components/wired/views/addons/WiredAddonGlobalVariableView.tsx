import { FC, useEffect, useState } from 'react';
import { GetConfiguration, LocalizeText } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredAddonBaseView } from './WiredAddonBaseView';

export const WiredAddonGlobalVariableView: FC = () =>
{
    const { trigger = null, setIntParams = null, setStringParam = null } = useWired();
    const [varName, setVarName] = useState('');
    const [permanent, setPermanent] = useState(0);

    const save = () => {
        setIntParams([permanent]);
        setStringParam(varName);
    };

    useEffect(() =>
    {
        setVarName(trigger.stringData || '');
        setPermanent((trigger.intData.length > 0) ? trigger.intData[0] : 0);
    }, [trigger]);

    return (
        <WiredAddonBaseView hasSpecialInput={true} save={save} requiresFurni={0}>
            <Column gap={1}>
                <Text bold>Nombre de la variable:</Text>
                <input type="text" className="form-control form-control-sm" maxLength={GetConfiguration<number>('wired.action.bot.talk.max.length', 64)} value={varName} onChange={event => setVarName(event.target.value)} />
            </Column>
            <Text bold>Opciones de disponibilidad:</Text>
            {[0, 1].map(mode =>
            {
                return (
                    <Flex key={mode} gap={1}>
                        <input
                            className="form-check-input"
                            type="radio"
                            name="wiredMode"
                            id={`wiredMode${mode}`}
                            checked={(permanent === mode)}
                            onChange={() => setPermanent(mode)} />

                        <Text>{LocalizeText('wired_var_global_' + mode)}</Text>
                    </Flex>
                )
            })}

        </WiredAddonBaseView>
    );
};