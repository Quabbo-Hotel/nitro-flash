import { FC, useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Button, Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredActionBaseView } from './WiredActionBaseView';

const RANGE_MIN = 1;
const RANGE_MAX = 10;
const PARAM_MODE = 0;
const PARAM_RANGE = 1;
const PARAM_CHAT = 2;

type LimitVisionMode = 'apply' | 'clear';

const clampRangeLevel = (value: number) =>
{
    const numericValue = Number.isFinite(value) ? Math.round(value) : RANGE_MIN;

    if(numericValue < RANGE_MIN) return RANGE_MIN;
    if(numericValue > RANGE_MAX) return RANGE_MAX;

    return numericValue;
};

export const WiredActionLimitUserVisionView: FC = () =>
{
    const [ mode, setMode ] = useState<LimitVisionMode>('apply');
    const [ rangeLevel, setRangeLevel ] = useState<number>(1);
    const [ seeChat, setSeeChat ] = useState<boolean>(true);
    const { trigger = null, setIntParams = null } = useWired();

    useEffect(() =>
    {
        if(!trigger)
        {
            setMode('apply');
            setRangeLevel(1);
            setSeeChat(true);
            return;
        }

        const params = trigger.intData || [];

        setMode(((params[PARAM_MODE] ?? 0) === 1) ? 'apply' : 'clear');
        setRangeLevel(clampRangeLevel(params[PARAM_RANGE] ?? 1));
        setSeeChat((params[PARAM_CHAT] ?? 1) === 1);
    }, [ trigger ]);

    const handleSliderChange = (value: number | readonly number[]) =>
    {
        const numericValue = Array.isArray(value) ? value[0] : value;

        setRangeLevel(clampRangeLevel(numericValue));
    };

    const save = () =>
    {
        if(!setIntParams) return;

        setIntParams([
            (mode === 'apply') ? 1 : 0,
            clampRangeLevel(rangeLevel),
            seeChat ? 1 : 0
        ]);
    };

    return (
        <WiredActionBaseView
            hasSpecialInput={ true }
            requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE }
            save={ save }>
            <Column gap={ 1 }>
                <Text gfbold>{ LocalizeText('wiredfurni.params.limitvision.mode.title') }</Text>
                <Flex gap={ 1 }>
                    <Button
                        className="w-100"
                        variant={ (mode === 'apply') ? 'success' : 'dark' }
                        onClick={ () => setMode('apply') }>
                        { LocalizeText('wiredfurni.params.limitvision.mode.apply') }
                    </Button>
                    <Button
                        className="w-100"
                        variant={ (mode === 'clear') ? 'danger' : 'dark' }
                        onClick={ () => setMode('clear') }>
                        { LocalizeText('wiredfurni.params.limitvision.mode.clear') }
                    </Button>
                </Flex>

                <Column gap={ 0.5 }>
                    <Flex alignItems="center" justifyContent="between" gap={ 1 }>
                        <Text bold>{ LocalizeText('wiredfurni.params.limitvision.range') }</Text>
                        <input
                            type="number"
                            min={ RANGE_MIN }
                            max={ RANGE_MAX }
                            className="form-control form-control-sm w-25"
                            value={ rangeLevel }
                            onChange={ event => setRangeLevel(clampRangeLevel(Number(event.target.value))) } />
                    </Flex>
                    <ReactSlider
                        className={ 'wired-slider' }
                        min={ RANGE_MIN }
                        max={ RANGE_MAX }
                        value={ rangeLevel }
                        onChange={ handleSliderChange } />
                    <Text small className="text-muted">
                        { LocalizeText('wiredfurni.params.limitvision.range_hint') }
                    </Text>
                </Column>

                <Flex alignItems="center" gap={ 1 }>
                    <input
                        id="limit-vision-chat-toggle"
                        type="checkbox"
                        className="form-check-input"
                        checked={ seeChat }
                        onChange={ event => setSeeChat(event.target.checked) } />
                    <label className="form-check-label" htmlFor="limit-vision-chat-toggle">
                        { LocalizeText('wiredfurni.params.limitvision.chat') }
                    </label>
                </Flex>
            </Column>
        </WiredActionBaseView>
    );
};
