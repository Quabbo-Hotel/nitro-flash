import { FC, useEffect, useState } from 'react';
import { Column, Flex, Text } from '../../../../common';
import { WiredActionBaseView } from './WiredActionBaseView';
import { useWired } from '../../../../hooks';
import { WiredFurniType } from '../../../../api';
import { VariableSelectorComponent } from './components';

// stringData = variable name
// int[0] = (no usado)
// int[1] = -1 (no usado)
// int[2] = dbId (cached)
// int[3] = targetType (0 = furni, 1 = user)
// int[4] = typeOfAdvancedOption (opciones avanzadas)

export const WiredActionRemoveVariableView: FC = () => {
    const { trigger = null, setStringParam = null, setIntParams = null } = useWired();
    
    const [selected, setSelected] = useState('');
    const [targetType, setTargetType] = useState(0); // 0 = furni, 1 = user
    const [typeOfAdvancedOption, setTypeOfAdvancedOption] = useState(4); // 4 = Items seleccionados (default)
    const [dbId, setDbId] = useState(0);

    // Cargar configuración previa
    useEffect(() => {
        if (!trigger) return;
        setSelected(trigger.stringData || '');
        const dbid = trigger.intData.length > 2 ? trigger.intData[2] : 0;
        const targ = trigger.intData.length > 3 ? trigger.intData[3] : 0;
        const advOpt = trigger.intData.length > 4 ? trigger.intData[4] : 4;
        setDbId(dbid);
        setTargetType(targ);
        setTypeOfAdvancedOption(advOpt);
    }, [trigger?.id]);

    // Guardar
    const save = () => {
        setStringParam(selected || '');
        setIntParams([0, -1, dbId, targetType, typeOfAdvancedOption]);
    };

    return (
        <WiredActionBaseView
            requiresFurni={WiredFurniType.STUFF_SELECTION_OPTION_BY_ID}
            hasSpecialInput
            save={save}
        >
            <Column gap={1}>
                <VariableSelectorComponent
                    selectedVariable={selected}
                    onVariableChange={setSelected}
                    targetType={targetType}
                    onTargetTypeChange={setTargetType}
                    typeOfAdvancedOption={typeOfAdvancedOption}
                    onAdvancedOptionChange={setTypeOfAdvancedOption}
                    label="Variable a remover:"
                    showAdvancedOptions={true}
                    placeholder="-- Selecciona variable --"
                    showInternal={false}
                    filterType="userCreated"
                    showGlobal={false}
                />
                
                {!selected && <Text small>Selecciona una variable creada en la sala (addon variable).</Text>}
            </Column>
        </WiredActionBaseView>
    );
};