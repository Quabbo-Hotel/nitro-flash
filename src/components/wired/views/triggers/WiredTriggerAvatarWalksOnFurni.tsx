import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredTriggerBaseView } from './WiredTriggerBaseView';

export const WiredTriggerAvatarWalksOnFurniView: FC<{}> = props =>
{

    const [typeOfAdvancedOptionOne, setTypeOfAdvancedOptionOne] = useState(0);

    const { trigger = null, setIntParams = null } = useWired();

    const save = () => setIntParams([typeOfAdvancedOptionOne]);

    useEffect(() =>
    {
        if (trigger?.intData?.length > 0)
        {
            setTypeOfAdvancedOptionOne(trigger.intData[0]);
        }
    }, [trigger]);


    return <WiredTriggerBaseView requiresFurni={WiredFurniType.STUFF_SELECTION_OPTION_BY_ID_OR_BY_TYPE} hasSpecialInput={false} save={save} >

        <Text bold>{LocalizeText('wiredfurni.params.select.furni.font')}</Text>
        <div className='align-advancedoptionsone'>

            <div className="button-group">
                <button
                    onClick={() => setTypeOfAdvancedOptionOne(0)}
                    className={` icon-neighbor-1 ${typeOfAdvancedOptionOne === 0 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`}
                />
                <button
                    onClick={() => setTypeOfAdvancedOptionOne(1)}
                    className={` icon-neighbor-5 ${typeOfAdvancedOptionOne === 1 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`}
                />



            </div>
        </div>
        {typeOfAdvancedOptionOne !== undefined && (
            <Text style={{ textAlign: "center" }}>{['Seleccionados', 'Selector'][typeOfAdvancedOptionOne]}</Text>
        )}

    </WiredTriggerBaseView>;
}
