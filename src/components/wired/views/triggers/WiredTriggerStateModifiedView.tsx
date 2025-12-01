import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredTriggerBaseView } from './WiredTriggerBaseView';

export const WiredTriggerStateModifiedView: FC<{}> = props =>
{

    const [typeOfAdvancedOptionOne, setTypeOfAdvancedOptionOne] = useState(0);
    const [itemMode, setItemMode] = useState(0);

    const { trigger = null, setIntParams = null } = useWired();

    const save = () => setIntParams([typeOfAdvancedOptionOne, itemMode]);

    useEffect(() =>
    {
        if (trigger?.intData?.length > 0)
        {
            setTypeOfAdvancedOptionOne(trigger.intData[0]);
            setItemMode(trigger.intData[1])
        }
    }, [trigger]);


    return <><WiredTriggerBaseView requiresFurni={WiredFurniType.STUFF_SELECTION_OPTION_BY_ID_OR_BY_TYPE} hasSpecialInput={false} save={save}>
        <Column gap={ 1 }>
        <Text gfbold>{LocalizeText('Selecciona las opciones:')}</Text>
        <Flex alignItems="center" gap={1}>
            <input className="form-check-input" type="radio" name="avatarMode" id="avatarMode0" checked={(itemMode=== 0)} onChange={event => setItemMode(0)} />
            <Text>{LocalizeText('Activa solo en el estado actual')}</Text>
        </Flex>
        <Flex alignItems="center" gap={1}>
            <input className="form-check-input" type="radio" name="avatarMode" id="avatarMode1" checked={(itemMode=== 1)} onChange={event => setItemMode(1)} />
            <Text>{LocalizeText('Activa en todos los estados')}</Text>
        </Flex>
    </Column>
        <Text bold>{LocalizeText('wiredfurni.params.select.furni.font')}</Text><div className='align-advancedoptionsone'>

            <div className="button-group">
                <button
                    onClick={() => setTypeOfAdvancedOptionOne(0)}
                    className={` icon-neighbor-1 ${typeOfAdvancedOptionOne === 0 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`} />
                <button
                    onClick={() => setTypeOfAdvancedOptionOne(1)}
                    className={` icon-neighbor-5 ${typeOfAdvancedOptionOne === 1 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`} />
            </div>
        </div>
    {
        typeOfAdvancedOptionOne !== undefined && (
            <Text style={{ textAlign: "center" }}>{['Seleccionados', 'Selector'][typeOfAdvancedOptionOne]}</Text>
        )
    }

    </WiredTriggerBaseView >;
    </>
}
