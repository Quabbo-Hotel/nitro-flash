import { FC, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredSelectorBaseView } from './WiredSelectorBaseView';

export const WiredSelectorByUsername: FC = () =>
{
    const [nameOfUsers, setNameOfUsers] = useState('');
    const { trigger = null, setStringParam = null } = useWired();

    const save = () =>
    {
        setStringParam(nameOfUsers);
    };

    useEffect(() =>
    {
        setNameOfUsers(trigger?.stringData || '');
    }, [trigger]);

    return (
        <WiredSelectorBaseView hasSpecialInput={true} save={save} requiresFurni={0}>
            <Text bold>{LocalizeText('wiredfurni.params.write.names')}</Text>
            <textarea
                value={nameOfUsers}
                onChange={(e) => setNameOfUsers(e.target.value)}
                rows={4}
                style={{ width: '100%', resize: 'none' }}
                placeholder="Escribe los nombres aquí, uno por línea..."
            />
        </WiredSelectorBaseView>
    );
};
