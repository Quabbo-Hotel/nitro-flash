import { FC, useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
import { GetWiredTimeLocale, LocalizeText, WiredFurniType } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionSpeedUserView: FC<{}> = props =>
    {
        const { trigger = null, setIntParams = null } = useWired();
    
        const initialPosition = trigger?.intData?.[0] ?? 1;
        const initialMode = trigger?.intData?.[1] ?? 3;
    
        const [position, setPosition] = useState(Math.min(Math.max(initialPosition, 1), 40));
        const [selectedMode, setSelectedMode] = useState(initialMode);
    
        const save = () => setIntParams([position, selectedMode]);
    
        useEffect(() =>
        {
            if(trigger?.intData?.length)
            {
                const [storedPosition, storedMode] = trigger.intData;
                setPosition(Math.min(Math.max(storedPosition, 1), 40));
                setSelectedMode(storedMode);
            }
        }, [trigger]);
    
        return (
            <WiredActionBaseView requiresFurni={WiredFurniType.STUFF_SELECTION_OPTION_NONE} hasSpecialInput={true} save={save}>
                <Column gap={1}>
                    <Text bold>{LocalizeText('wired.fastwalk.mode.title')}</Text>
                    
                    <Column gap={1}>
                        {[0, 1].map(mode => (
                            <Flex key={mode} gap={1}>
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="fastWalkMode"
                                    checked={selectedMode === mode}
                                    onChange={() => setSelectedMode(mode)}
                                />
                                <Text>
                                    {LocalizeText(`wired.fastwalk.mode.${mode}`)}
                                </Text>
                            </Flex>
                        ))}
                    </Column>
    
                    {selectedMode === 1 &&
                        <>
                            <Text bold>
                                {LocalizeText('wiredfurni.params.delay', 
                                    ['miliseconds'], 
                                    [GetWiredTimeLocale((position * 50) / 1000)])}
                            </Text>
                            <ReactSlider
                                className={'nitro-slider'}
                                min={1}
                                max={40}
                                step={1}
                                value={position}
                                onChange={value => setPosition(value)}
                                renderThumb={(props) => <div {...props}>{position}</div>}
                            />
                        </>}
                </Column>
            </WiredActionBaseView>
        );
    };
    