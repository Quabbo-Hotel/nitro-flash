import { FC, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredSelectorBaseView } from './WiredSelectorBaseView';

export const WiredSelectorFurniOnFurni: FC<{}> = () =>
{
    const [typeOfHeight, setTypeOfHeight] = useState(0);
    const { trigger = null, setIntParams = null } = useWired();
    const [typeOfAdvancedOptionOne, setTypeOfAdvancedOptionOne] = useState(1); // 👈 inicia en 1

    const save = () => setIntParams([typeOfHeight, typeOfAdvancedOptionOne]);

    useEffect(() =>
    {
        if (trigger && trigger.intData.length > 0)
        {
            setTypeOfHeight(trigger.intData[0]);
            // 👇 si no existe el valor, queda en 1
            setTypeOfAdvancedOptionOne(trigger.intData[1] ?? 1);
        }
    }, [trigger]);

    return (
        <WiredSelectorBaseView hasSpecialInput={true} save={save} requiresFurni={1}>
            <Column gap={1}>
                <Text bold>{LocalizeText('wired_select_mode_u_want')}</Text>
                {[0, 1, 2, 3].map(mode =>
                    <Flex key={mode} gap={1}>
                        <input
                            type="radio"
                            name="wiredToggle"
                            checked={(typeOfHeight === mode)}
                            onChange={() => setTypeOfHeight(mode)}
                        />
                        <Text>{LocalizeText('wired.paramsfurnionfurni.mode.' + mode)}</Text>
                    </Flex>
                )}
            </Column>

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
                    {['Usar Item desencadenante', 'Seleccionados', 'Señal'][typeOfAdvancedOptionOne]}
                </Text>
            )}
        </WiredSelectorBaseView>
    );
};
