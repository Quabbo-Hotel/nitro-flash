import { FC, useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
import { LocalizeText } from '../../../../api';
import { Button, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredSelectorBaseView } from './WiredSelectorBaseView';

export const WiredSelectorFurniFilter: FC = () =>
{
    const [value, setValue] = useState(50);
    const { trigger = null, setIntParams = null } = useWired();

    const save = () => setIntParams([value]);

    useEffect(() =>
    {
        setValue((trigger.intData.length > 0) ? trigger.intData[0] : 0);
        
    }, [trigger]);

    return (
        <WiredSelectorBaseView hasSpecialInput={true} save={save} requiresFurni={0}>
            <Text bold>{LocalizeText('wiredfurni.params.filter.for') + " " + value + " Furnis"}</Text>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Button onClick={() => setValue(prev => Math.max(1, prev - 1))}>-</Button>
                <ReactSlider
                    className={'nitro-slider'}
                    min={1}
                    max={100}
                    value={value}
                    onChange={(val) => setValue(val as number)}
                />
                <Button onClick={() => setValue(prev => Math.min(100, prev + 1))}>+</Button>
            </div>
        </WiredSelectorBaseView>
    );
};
