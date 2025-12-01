import { FC, useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Column, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionRelativeMovesView: FC<{}> = () =>
{
    const [yType, setYType] = useState(0);
    const [yValue, setYValue] = useState(0);
    const [xType, setXType] = useState(0);
    const [xValue, setXValue] = useState(0);
    const { trigger = null, setIntParams = null } = useWired();

    const save = () =>
    {
        setIntParams([yType, yValue, xType, xValue]);
    }

    useEffect(() =>
    {
        if (trigger)
        {
            if (trigger.intData?.length >= 4)
            {
                setYType(trigger.intData[0]);
                setYValue(trigger.intData[1]);
                setXType(trigger.intData[2]);
                setXValue(trigger.intData[3]);
            }
        }
        else
        {
            setYType(0);
            setYValue(0);
            setXType(0);
            setXValue(0);
        }
    }, [trigger]);

    return (
        <WiredActionBaseView
            requiresFurni={WiredFurniType.STUFF_SELECTION_OPTION_BY_ID_OR_BY_TYPE}
            hasSpecialInput={true}
            save={save}
        >
            <Column gap={1}>
                <Text gfbold>{LocalizeText('wiredfurni.params.x')}</Text>
                <div>
                    <label style={{ marginLeft: '10px' }}>
                        <input
                            type="radio"
                            name="xType"
                            value={1}
                            checked={xType === 1}
                            onChange={() => setXType(1)}
                        />
                        <i className="icon icon-se"></i>
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="xType"
                            value={0}
                            checked={xType === 0}
                            onChange={() => setXType(0)}
                        />
                        <i className="icon icon-nw"></i>
                    </label>
                </div>
                <ReactSlider
                    className="nitro-slider"
                    min={0}
                    max={20}
                    value={xValue}
                    onChange={(value: number) => setXValue(value)}
                />
                <Text>{xValue}</Text>
            </Column>
            <Column gap={1}>
                <Text gfbold>{LocalizeText('wiredfurni.params.y')}</Text>
                <div>
                    <label style={{ marginLeft: '10px' }}>
                        <input
                            type="radio"
                            name="yType"
                            value={1}
                            checked={yType === 1}
                            onChange={() => setYType(1)}
                        />
                        <i className="icon icon-sw"></i>
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="yType"
                            value={0}
                            checked={yType === 0}
                            onChange={() => setYType(0)}
                        />
                        <i className="icon icon-ne"></i>
                    </label>
                </div>
                <ReactSlider
                    className="nitro-slider"
                    min={0}
                    max={20}
                    value={yValue}
                    onChange={(value: number) => setYValue(value)}
                />
                <Text>{yValue}</Text>
            </Column>

            
        </WiredActionBaseView>
    );
}
