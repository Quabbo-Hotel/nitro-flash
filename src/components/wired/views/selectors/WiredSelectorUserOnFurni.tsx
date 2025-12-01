import { FC, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredSelectorBaseView } from './WiredSelectorBaseView';

export const WiredSelectorUserOnFurni: FC<{}> = () =>
{
    const { trigger = null, setIntParams = null } = useWired();
    const [typeOfAdvancedOptionOne, setTypeOfAdvancedOptionOne] = useState(0);

    const save = () => setIntParams([typeOfAdvancedOptionOne]);

    useEffect(() =>
    {
        if (trigger && trigger.intData.length > 0)
        {
            setTypeOfAdvancedOptionOne(trigger.intData[0])
        }
    }, [trigger]);



    return (
        <WiredSelectorBaseView hasSpecialInput={true} save={save} requiresFurni={1}>
            <Text bold>{LocalizeText('wiredfurni.params.select.furni.font')}</Text>
                        <div className='align-advancedoptionsone'>
                            <div className="button-group">
                                <button
                                    onClick={() => setTypeOfAdvancedOptionOne(0)}
                                    className={` icon-neighbor-3 ${typeOfAdvancedOptionOne === 0 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`}
                                />
                                <button
                                    onClick={() => setTypeOfAdvancedOptionOne(1)}
                                    className={` icon-neighbor-1 ${typeOfAdvancedOptionOne === 1 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`}
                                />
                                <button
                                    onClick={() => setTypeOfAdvancedOptionOne(2)}
                                    className={` icon-neighbor-2 ${typeOfAdvancedOptionOne === 2 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`}
                                />
                            </div>
                        </div>
                        {typeOfAdvancedOptionOne !== undefined && (
                            <Text style={{ textAlign: "center" }}>{['Usar Item desencadenante', 'Seleccionados', 'Señal'][typeOfAdvancedOptionOne]}</Text>
                        )}
        </WiredSelectorBaseView>
    );
};
