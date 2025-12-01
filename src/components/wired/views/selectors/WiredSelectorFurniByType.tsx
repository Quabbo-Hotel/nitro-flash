import { FC, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredSelectorBaseView } from './WiredSelectorBaseView';

export const WiredSelectorFurniByType: FC<{}> = () =>
{
    const [stateMatch, setStateMatch] = useState(0);
    const [typeOfAdvancedOptionOne, setTypeOfAdvancedOptionOne] = useState(1); // 👈 por defecto en 1
    const [rotationMatch, setRotationMatch] = useState(0);
    const { trigger = null, setIntParams = null } = useWired();

    const save = () => setIntParams([stateMatch, typeOfAdvancedOptionOne, rotationMatch]);

    useEffect(() =>
    {
        if (trigger && trigger.intData.length > 0)
        {
            setStateMatch(trigger.intData[0]);
            // 👇 Si no viene nada en intData[1], queda en 1 por defecto
            setTypeOfAdvancedOptionOne(trigger.intData[1] ?? 1);
            setRotationMatch(trigger.intData[2] || 0);
        }
    }, [trigger]);

    return (
        <WiredSelectorBaseView hasSpecialInput={true} requiresFurni={1} save={save}>
            <Flex alignItems="center" gap={1}>
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="stateMatch"
                    checked={stateMatch === 1}
                    onChange={(event) => setStateMatch(event.target.checked ? 1 : 0)}
                />
                <Text>{LocalizeText('wiredfurni.params.state.correspond')}</Text>
            </Flex>

            <Flex alignItems="center" gap={1}>
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="rotationMatch"
                    checked={rotationMatch === 1}
                    onChange={(event) => setRotationMatch(event.target.checked ? 1 : 0)}
                />
                <Text>Solo seleccionar si la rotación coincide</Text>
            </Flex>
            
            <hr className="m-0 bg-dark" />
            <Text bold>{LocalizeText('wiredfurni.params.select.furni.font')}</Text>
            <div className='align-advancedoptionsone'>
                <div className="button-group">
                    <button
                        onClick={() => setTypeOfAdvancedOptionOne(1)}
                        className={` icon-neighbor-1 ${typeOfAdvancedOptionOne === 1 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`}
                    />
                    <button
                        onClick={() => setTypeOfAdvancedOptionOne(0)}
                        className={` icon-neighbor-3 ${typeOfAdvancedOptionOne === 0 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`}
                    />
                    <button
                        onClick={() => setTypeOfAdvancedOptionOne(2)}
                        className={` icon-neighbor-2 ${typeOfAdvancedOptionOne === 2 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`}
                    />
                </div>
            </div>

            {typeOfAdvancedOptionOne !== undefined && (
                <Text style={{ textAlign: "center" }}>
                    {['Item Desencadenante', 'Seleccionados', 'Señal'][typeOfAdvancedOptionOne]}
                </Text>
            )}
        </WiredSelectorBaseView>
    );
};
