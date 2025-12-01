import { FC, useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Button, Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionSetHeightView: FC<{}> = props =>
{
    const [mode, setMode] = useState(0);
    const [height, setHeight] = useState(0);
    const [inputValue, setInputValue] = useState('0.00');
    const { trigger = null, setIntParams = null, setStringParam = null } = useWired();

    useEffect(() =>
    {
        setInputValue(height.toFixed(2));
    }, [height]);

    const handleInputBlur = () =>
    {
        const value = parseFloat(inputValue);
        if (!isNaN(value))
        {
            const clampedValue = Math.max(0, Math.min(40, value));
            setHeight(clampedValue);
        }
    };
    const save = () =>
    {
        setIntParams([mode]);
        setStringParam(height.toString())
    }

    useEffect(() =>
    {
        if (trigger?.intData?.length >= 1)
        {
            setMode(trigger.intData[0]);
            setHeight(parseFloat(trigger.stringData || '0'));
        }
        else
        {
            setMode(0);
        }
    }, [trigger]);

    return (
        <WiredActionBaseView
            requiresFurni={WiredFurniType.STUFF_SELECTION_OPTION_BY_ID_BY_TYPE_OR_FROM_CONTEXT}
            hasSpecialInput={true}
            save={save}
        >
            <Text>{'Selecciona el modo de altura:'}</Text>
            <Column gap={1}>
                <label>
                    <input
                        type="radio"
                        name="timerMode"
                        value={0}
                        checked={mode === 0}
                        onChange={() => setMode(0)}
                    />
                    Aumentar
                </label>
                <label>
                    <input
                        type="radio"
                        name="timerMode"
                        value={1}
                        checked={mode === 1}
                        onChange={() => setMode(1)}
                    />
                    Disminuir
                </label>
                <label>
                    <input
                        type="radio"
                        name="timerMode"
                        value={3}
                        checked={mode === 3}
                        onChange={() => setMode(3)}
                    />
                    Establecer
                </label>

                <Flex alignItems="center" justifyContent="between">
                    <Text bold>{LocalizeText('Altura:')}</Text>
                    <Flex gap={1}>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onBlur={handleInputBlur}
                            onKeyPress={(e) => e.key === 'Enter' && handleInputBlur()}
                            style={{ width: '80px', textAlign: 'center' }}
                        />
                        <Text>m</Text>
                    </Flex>
                </Flex>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0' }}>
                    <Button onClick={() => setHeight(prev => Number((Math.max(0, prev - 0.01)).toFixed(2)))}>
                        -
                    </Button>

                    <ReactSlider
                        className={'nitro-slider'}
                        min={0}
                        max={40}
                        step={0.01}
                        value={height}
                        onChange={(val) => setHeight(Number((Array.isArray(val) ? val[0] : val).toFixed(2)))}
                        renderThumb={(props, state) => <div {...props}>{state.valueNow.toFixed(2)}</div>}
                    />

                    <Button onClick={() => setHeight(prev => Number((Math.min(40, prev + 0.01)).toFixed(2)))}>
                        +
                    </Button>
                </div>
            </Column>
        </WiredActionBaseView>
    );
}
