import { FC, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { Column, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredAddonBaseView } from './WiredAddonBaseView';
import { WiredSliderArrows } from '../WiredSliderArrows';

export const WiredAddonExecutionLimitView: FC = () => {
    const [executions, setExecutions] = useState(1);
    const [timeSeconds, setTimeSeconds] = useState(1);
    const { trigger = null, setIntParams = null } = useWired();

    const save = () => setIntParams([executions, Math.round(timeSeconds * 2)]);

    useEffect(() => {
        if (trigger.intData.length >= 2) {
            setExecutions(trigger.intData[0]);
            setTimeSeconds(trigger.intData[1] / 2);
        } else {
            setExecutions(2);
            setTimeSeconds(8);
        }
    }, [trigger]);

    return (
        <WiredAddonBaseView hasSpecialInput={true} save={save} requiresFurni={0}>
            <Column gap={1}>
                <Text gfbold>
                    {LocalizeText('wiredfurni.params.executionlimit.executions')} {executions}
                </Text>
                <WiredSliderArrows
                    min={1}
                    max={10}
                    step={1}
                    value={executions}
                    onChange={value => setExecutions(value)} />
                <hr className="m-0 bg-dark" />
                <Text gfbold>
                    {LocalizeText('wiredfurni.params.executionlimit.time')} {timeSeconds} segundos
                </Text>
                <WiredSliderArrows
                    min={0}
                    max={119}
                    step={1}
                    value={Math.round(timeSeconds * 2) - 1}
                    onChange={value => setTimeSeconds((value + 1) / 2)} />
            </Column>
        </WiredAddonBaseView>
    );
};
