import { FC, useEffect, useState } from 'react';
import { Column, Flex, Text } from '../../../../common';
import { WiredActionBaseView } from './WiredActionBaseView';
import { useWired } from '../../../../hooks';
import { WiredFurniType } from '../../../../api';
import { VariableSelectorComponent } from './components';

// stringData = variable name
// int[0] = replaceExisting (0/1)
// int[1] = initialValue or -1
// int[2] = dbId (cached)
// int[3] = targetType (0 = furni, 1 = user)
// int[4] = typeOfAdvancedOption (opciones avanzadas)

export const WiredActionGiveVariableView: FC = () => {
    const { trigger = null, setStringParam = null, setIntParams = null } = useWired();
    
    const [selected, setSelected] = useState('');
    const [replaceExisting, setReplaceExisting] = useState(false);
    const [initialValue, setInitialValue] = useState(0);
    const [targetType, setTargetType] = useState(0); // 0 = furni, 1 = user
    const [typeOfAdvancedOption, setTypeOfAdvancedOption] = useState(4); // 4 = Items seleccionados (default)
    const [dbId, setDbId] = useState(0);

    // Cargar configuración previa
    useEffect(() => {
        if (!trigger) return;
        setSelected(trigger.stringData || '');
        const rep = trigger.intData.length > 0 ? trigger.intData[0] === 1 : false;
        const initVal = trigger.intData.length > 1 ? trigger.intData[1] : 0;
        const dbid = trigger.intData.length > 2 ? trigger.intData[2] : 0;
        const targ = trigger.intData.length > 3 ? trigger.intData[3] : 0;
        const advOpt = trigger.intData.length > 4 ? trigger.intData[4] : 4;
        setReplaceExisting(rep);
        setInitialValue(initVal);
        setDbId(dbid);
        setTargetType(targ);
        setTypeOfAdvancedOption(advOpt);
    }, [trigger?.id]);

    // Determinar si la variable seleccionada tiene valor
    // Nota: Esta lógica podría mejorarse pasando selectedDef desde VariableSelectorComponent
    const selectedHasValue = true; // Simplificado por ahora
    
    useEffect(() => {
        // Ajustar initialValue basado en si la variable tiene valor
        // Esta lógica podría mejorarse con comunicación del componente hijo
    }, [selected]);

    // Guardar
    const save = () => {
        setStringParam(selected || '');
        setIntParams([replaceExisting ? 1 : 0, selectedHasValue ? initialValue : -1, dbId, targetType, typeOfAdvancedOption]);
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
                    label="Variable a asignar:"
                    showAdvancedOptions={true}
                    placeholder="-- Selecciona variable --"
                    filterType="userCreated"
                    showGlobal={false}
                />

                <Flex gap={1} alignItems='center'>
                    <input type='checkbox' checked={replaceExisting} onChange={e => setReplaceExisting(e.target.checked)} />
                    <Text small>Sustituir variable existente</Text>
                </Flex>

                <Text bold>Valor inicial</Text>
                <input
                    type='number'
                    className='form-control form-control-sm'
                    style={{ paddingLeft: '5px' }}
                    disabled={!selectedHasValue}
                    value={selectedHasValue ? initialValue : -1}
                    onChange={e => setInitialValue(parseInt(e.target.value) || 0)}
                />
                
                {!selected && <Text small>Selecciona una variable creada en la sala (addon variable).</Text>}
                {selected && !selectedHasValue && <Text small>Esta variable no almacena valor. Se usará -1.</Text>}
            </Column>
        </WiredActionBaseView>
    );
};
