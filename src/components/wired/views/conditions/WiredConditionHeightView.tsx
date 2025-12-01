import { FC, useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Button, Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredConditionBaseView } from './WiredConditionBaseView';

export const WiredConditionHeightView: FC<{}> = props =>
{
    const [typeOfHeight, setTypeOfHeight] = useState(0);
    const [height, setHeight] = useState(0);
    const [inputValue, setInputValue] = useState('0.00');
    
    const { trigger = null, setIntParams = null } = useWired();

    const save = () => setIntParams([ typeOfHeight, Math.round(height * 100) ]);

    useEffect(() =>
    {
        if(trigger && trigger.intData.length > 0)
        {
            const newHeight = trigger.intData[1] / 100;
            setHeight(newHeight);
            setInputValue(newHeight.toFixed(2));
            setTypeOfHeight(trigger.intData[0])
        }
    }, [ trigger ]);

    useEffect(() =>
    {
        setInputValue(height.toFixed(2));
    }, [ height ]);

    const handleInputBlur = () =>
    {
        const value = parseFloat(inputValue);
        if(!isNaN(value))
        {
            const clampedValue = Math.max(0, Math.min(40, value));
            setHeight(clampedValue);
        }
    };

    return (
        <WiredConditionBaseView
            requiresFurni={WiredFurniType.STUFF_SELECTION_OPTION_BY_ID}
            hasSpecialInput={true}
            save={save}
            allOrOne
            allOrOneFor={2}>
            
            <Column gap={1}>
                <Text bold>{LocalizeText('wired_select_mode_u_want')}</Text>
                {[ 0, 1, 2 ].map(mode =>
                    <Flex key={mode} gap={1}>
                        <input
                            type="radio"
                            name="wiredToggleHeight"  // 👈 cambiado, ahora no choca con el baseview
                            checked={(typeOfHeight === mode)}
                            onChange={() => setTypeOfHeight(mode)} />
                        <Text>{LocalizeText('wired.params.height.mode.' + mode)}</Text>
                    </Flex>
                )}
            </Column>

            <hr className="m-0 bg-dark" />

            <Flex alignItems="center" justifyContent="between">
                <Text bold>{LocalizeText('wiredfurni.params.filter.for')}</Text>
                <Flex gap={1}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onBlur={handleInputBlur}
                        onKeyPress={(e) => e.key === 'Enter' && handleInputBlur()}
                        style={{ width: '80px', textAlign: 'center' }} />
                    <Text>m</Text>
                </Flex>
            </Flex>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0' }}>
                <Button onClick={() => setHeight(prev => Number((Math.max(0, prev - 0.01)).toFixed(2)))}> - </Button>
                <ReactSlider
                    className={'nitro-slider'}
                    min={0}
                    max={40}
                    step={0.01}
                    value={height}
                    onChange={(val) => setHeight(Number(val.toFixed(2)))}
                    renderThumb={(props, state) => <div {...props}>{state.valueNow.toFixed(2)}</div>} />
                <Button onClick={() => setHeight(prev => Number((Math.min(40, prev + 0.01)).toFixed(2)))}> + </Button>
            </div>

        </WiredConditionBaseView>
    );
};
