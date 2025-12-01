import { FC, useEffect, useState } from 'react';
import { GetConfiguration, LocalizeText } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredAddonBaseView } from './WiredAddonBaseView';

export const WiredAddonGlobalVariableView: FC = () =>
{
    const { trigger = null, setIntParams = null, setStringParam = null } = useWired();
    const [varName, setVarName] = useState('');
    const [availabilityMode, setAvailabilityMode] = useState(0);

    const resolveAvailabilityLabel = (mode: number) =>
    {
        if(mode === 2)
        {
            const shared = LocalizeText('wired_var_global_shared_rooms');
            return (shared && (shared !== 'wired_var_global_shared_rooms')) ? shared : 'Permanente compartida entre salas';
        }

        const key = `wired_var_global_${ mode }`;
        const localized = LocalizeText(key);

        if(localized && (localized !== key)) return localized;

        return (mode === 0) ? 'Mientras la sala está activa' : 'Permanente';
    };

    const save = () => {
        setIntParams([availabilityMode]);
        setStringParam(varName);
    };

    useEffect(() =>
    {
        setVarName(trigger.stringData || '');
        setAvailabilityMode((trigger.intData.length > 0) ? trigger.intData[0] : 0);
    }, [trigger]);

    return (
        <WiredAddonBaseView hasSpecialInput={true} save={save} requiresFurni={0}>
            <Column gap={1}>
                <Text bold>Nombre de la variable:</Text>
                <input type="text" className="form-control form-control-sm" maxLength={GetConfiguration<number>('wired.action.bot.talk.max.length', 64)} value={varName} onChange={event => setVarName(event.target.value)} />
            </Column>
            <Text bold>Opciones de disponibilidad:</Text>
            {[0, 1, 2].map(mode =>
            {
                return (
                    <Flex key={mode} gap={1}>
                        <input
                            className="form-check-input"
                            type="radio"
                            name="wiredMode"
                            id={`wiredMode${mode}`}
                            checked={(availabilityMode === mode)}
                            onChange={() => setAvailabilityMode(mode)} />

                        <Text>{resolveAvailabilityLabel(mode)}</Text>
                    </Flex>
                )
            })}

        </WiredAddonBaseView>
    );
};