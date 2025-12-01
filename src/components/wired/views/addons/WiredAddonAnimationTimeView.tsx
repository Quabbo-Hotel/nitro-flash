import { FC, useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
import { LocalizeText } from '../../../../api';
import { Button, Column, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredAddonBaseView } from './WiredAddonBaseView';

export const WiredAddonAnimationTimeView: FC = () => {
    const [max, setMax] = useState(1);
    const { trigger = null, setIntParams = null } = useWired();

    const save = () => setIntParams([max]);

    useEffect(() => {
        if (trigger.intData.length >= 1) {
            setMax(trigger.intData[0]);
        }
        else {
            setMax(50);
        }
    }, [trigger]);

    return (
        <WiredAddonBaseView hasSpecialInput={true} save={save} requiresFurni={0}>
            <Column gap={1}>
                <Text gfbold>
                    {LocalizeText('wiredfurni.params.usercountmax', ['value'], [max.toString()])}
                </Text>

            </Column>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0' }}>
                <Button onClick={() => setMax(prev => Math.max(50, prev - 50))}>
    -
</Button>

<ReactSlider
    className={'nitro-slider'}
    min={50}
    max={2000}
    step={50}
    value={max}
    onChange={value => setMax(value)} />

<Button onClick={() => setMax(prev => Math.min(2000, prev + 50))}>
    +
</Button>

            </div>
        </WiredAddonBaseView>
    );
};
