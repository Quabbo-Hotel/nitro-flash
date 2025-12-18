import { FC, useEffect, useState } from 'react';
import { WiredSliderArrows } from '../WiredSliderArrows';
import { Column, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredTriggerBaseView } from './WiredTriggerBaseView';
import { WiredFurniType } from '../../../../api';


export const WiredTriggerExecutePeriodicallyShortView: FC<{}> = props =>
{
    const [ time, setTime ] = useState(1);
    const { trigger = null, setIntParams = null } = useWired();

    const save = () => setIntParams([ time ]);

    useEffect(() =>
    {
        setTime((trigger.intData.length > 0) ? trigger.intData[0] : 0);
    }, [ trigger ]);

    return (
        <WiredTriggerBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <Column gap={ 1 }>
                <Text gfbold>Establecer tiempo: { time * 10 } ms</Text>
                <WiredSliderArrows
                    min={1}
                    max={60}
                    step={5}
                    value={time}
                    onChange={value => setTime(Math.round(value / 5) * 5)} />
            </Column>
        </WiredTriggerBaseView>
    );
}
