import { FC, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { Column, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredSelectorBaseView } from './WiredSelectorBaseView';

const ACCIONES = [
    { value: 0, label: 'Waving hand' },
    { value: 1, label: 'Blowing kiss' },
    { value: 2, label: 'Luaghing' },
    { value: 3, label: 'Thumbsup ' },
    { value: 4, label: 'Awake' },
    { value: 5, label: 'afk/sleeping' },
    { value: 6, label: 'sitted' },
    { value: 7, label: 'wake up' },
    { value: 8, label: 'layed down' },
    { value: 9, label: 'sending signals' },
    { value: 10, label: 'dancing' }
];

export const WiredSelectorUsersByAction: FC<{}> = () =>
{
    const { trigger = null, setIntParams = null } = useWired();
    const [userType, setUserType] = useState(0);

    const save = () => setIntParams([userType]);

    useEffect(() =>
    {
        if (trigger && trigger.intData.length > 0)
        {
            setUserType(trigger.intData[0]);
        }
    }, [trigger]);

    return (
        <WiredSelectorBaseView hasSpecialInput={true} save={save} requiresFurni={0}>
            <Column gap={1}>
                <Text bold>{LocalizeText('wiredfurni.params.actions.title')}</Text>
                <select
                    className="form-select form-select-sm"
                    value={userType}
                    onChange={(e) => setUserType(parseInt(e.target.value))}
                >
                    {ACCIONES.map(accion => (
                        <option key={accion.value} value={accion.value}>
                            {accion.label}
                        </option>
                    ))}
                </select>
            </Column>
        </WiredSelectorBaseView>
    );
};
