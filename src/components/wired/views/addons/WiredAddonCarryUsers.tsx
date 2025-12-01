import { FC, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredAddonBaseView } from './WiredAddonBaseView';

export const WiredAddonCarryUsers: FC = () =>
{
    const [selectedMode, setSelectedMode] = useState(-1);
    const [typeOfAdvancedOptionOne, setTypeOfAdvancedOptionOne] = useState(0);
    const { trigger = null, setIntParams = null } = useWired();

    const save = () => setIntParams([selectedMode, typeOfAdvancedOptionOne]);

    useEffect(() =>
    {
        setSelectedMode((trigger.intData.length > 0) ? trigger.intData[0] : 0);
        setTypeOfAdvancedOptionOne(trigger.intData[1] || 0);
    }, [trigger]);

    return (
        <WiredAddonBaseView hasSpecialInput={true} save={save} requiresFurni={0}>
            {[0,1].map(mode =>
            {
                return (
                    <Flex key={mode} gap={1}>
                        <input className="form-check-input" type="radio" name="selectedMode" id={`selectedMode${mode}`} checked={(selectedMode === mode)} onChange={event => setSelectedMode(mode)} />
                        <Text>{LocalizeText(`wiredfurni.params.mode.${mode}`)}</Text>
                    </Flex>
                )
            })}
            <Text bold>{LocalizeText('wiredfurni.params.select.furni.font')}</Text>
                        <div className='align-advancedoptionsone'>
            
                            <div className="button-group">

                                <button
                                    onClick={() => setTypeOfAdvancedOptionOne(0)}
                                    className={` icon-neighbor-1 ${typeOfAdvancedOptionOne === 0 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`}
                                />
                                <button
                                    onClick={() => setTypeOfAdvancedOptionOne(1)}
                                    className={` icon-neighbor-3 ${typeOfAdvancedOptionOne === 1 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`}
                                />
                                <button
                                    onClick={() => setTypeOfAdvancedOptionOne(2)}
                                    className={` icon-neighbor-5 ${typeOfAdvancedOptionOne === 2 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`}
                                />
                                <button
                                    onClick={() => setTypeOfAdvancedOptionOne(3)}
                                    className={` icon-neighbor-2 ${typeOfAdvancedOptionOne === 3 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`}
                                />
            
            
            
                            </div>
                        </div>
                        {typeOfAdvancedOptionOne !== undefined && (
                            <Text style={{ textAlign: "center" }}>{['Todos en la Sala', 'Usuario Accionador', 'Usuario de Selector', 'Usuario de Señal'][typeOfAdvancedOptionOne]}</Text>
                        )}
        </WiredAddonBaseView>
    );
};
