import { FC, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredSelectorBaseView } from './WiredSelectorBaseView';

export const WiredSelectorUserOnTeam: FC<{}> = () =>
{
    const { trigger = null, setIntParams = null } = useWired();
    const [team, setTeam] = useState(0);

    const save = () => setIntParams([team]);

    useEffect(() =>
    {
        if (trigger && trigger.intData.length > 0)
        {
            setTeam(trigger.intData[0])
        }
    }, [trigger]);



    return (
        <WiredSelectorBaseView hasSpecialInput={true} save={save} requiresFurni={0}>
            <Column gap={1}>
                <Text bold>{LocalizeText('wired_select_mode_u_want')}</Text>
                {[0, 1, 2, 3, 4].map(mode =>
                    <Flex key={mode} gap={1}>
                        <input
                            type="radio"
                            name="wiredToggle"
                            checked={(team === mode)}
                            onChange={() => setTeam(mode)}
                        />
                        <Text>{LocalizeText('wired.params.selector.team.' + mode)}</Text>
                    </Flex>
                )}
            </Column>
        </WiredSelectorBaseView>
    );
};
