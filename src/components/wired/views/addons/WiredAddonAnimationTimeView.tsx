import { FC, useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
import { LocalizeText } from '../../../../api';
import { Button, Column, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredAddonBaseView } from './WiredAddonBaseView';
import { WiredSliderArrows } from '../WiredSliderArrows';

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
                    Tiempo de animación {max} ms
                </Text>

            </Column>
            
                <WiredSliderArrows
                    min={50}
                    max={2000}
                    step={50}
                    value={max}
                    onChange={value => setMax(Math.round(value / 50) * 50)} />
        
        </WiredAddonBaseView>
    );
};
