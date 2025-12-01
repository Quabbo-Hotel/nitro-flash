import { FC, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredSelectorBaseView } from './WiredSelectorBaseView';
import { VariableSelectorComponent } from '../actions/components/VariableSelectorComponent';

export const WiredSelectorFurniWithVar: FC<{}> = () => {
    const [selectedVariable, setSelectedVariable] = useState('');
    const [selectByValue, setSelectByValue] = useState(false);
    const [comparisonType, setComparisonType] = useState(0); // 0: >, 1: >=, 2: ==, 3: <=, 4: <, 5: !=
    const [referenceType, setReferenceType] = useState(0); // 0: define value, 1: from variable
    const [referenceValue, setReferenceValue] = useState(0);
    const [referenceVariable, setReferenceVariable] = useState('');
    const [referenceVarTargetType, setReferenceVarTargetType] = useState(0);
    const [referenceVarAdvancedOption, setReferenceVarAdvancedOption] = useState(4);

    const { trigger = null, setStringParam = null, setIntParams = null } = useWired();

    const save = () => {
        setStringParam(selectedVariable + (referenceType === 1 ? "::" + referenceVariable : ""));
        setIntParams([
            selectByValue ? 1 : 0,
            comparisonType,
            referenceType,
            referenceValue,
            referenceVarTargetType,
            referenceVarAdvancedOption
        ]);
    };

    useEffect(() => {
        if (trigger) {
            const parts = (trigger.stringData || "").split("::", 2);
            setSelectedVariable(parts[0] || '');
            setReferenceVariable(parts[1] || '');
            if (trigger.intData.length > 0) {
                setSelectByValue(trigger.intData[0] === 1);
                setComparisonType(trigger.intData[1] || 0);
                setReferenceType(trigger.intData[2] || 0);
                setReferenceValue(trigger.intData[3] || 0);
                setReferenceVarTargetType(trigger.intData[4] || 0);
                setReferenceVarAdvancedOption(trigger.intData[5] || 4);
            }
        }
    }, [trigger]);

    const comparisonOptions = [
        { value: 0, label: 'Mayor que' },
        { value: 1, label: 'Mayor o igual' },
        { value: 2, label: 'Igual' },
        { value: 3, label: 'Menor o igual' },
        { value: 4, label: 'Menor que' },
        { value: 5, label: 'Desigual' }
    ];

    return (
        <WiredSelectorBaseView hasSpecialInput={true} save={save} requiresFurni={0}>
            <Column gap={1}>
                <VariableSelectorComponent
                    selectedVariable={selectedVariable}
                    onVariableChange={setSelectedVariable}
                    targetType={0} // furni
                    onTargetTypeChange={() => {}} // fixed to furni
                    typeOfAdvancedOption={4} // default
                    onAdvancedOptionChange={() => {}}
                    label="Variable de furni:"
                    showAdvancedOptions={false}
                    placeholder="-- Selecciona variable --"
                    showGlobal={false}
                    showTargetButtons={false}
                />

                <Flex gap={1} alignItems='center'>
                    <input type='checkbox' checked={selectByValue} onChange={e => setSelectByValue(e.target.checked)} />
                    <Text>Seleccionar por valor</Text>
                </Flex>

                {selectByValue && (
                    <>
                        <Text bold>Escoja el tipo:</Text>
                        <Column gap={1}>
                            {comparisonOptions.map(option => (
                                <Flex key={option.value} gap={1} alignItems='center'>
                                    <input
                                        type='radio'
                                        name='comparison'
                                        value={option.value}
                                        checked={comparisonType === option.value}
                                        onChange={e => setComparisonType(parseInt(e.target.value))}
                                    />
                                    <Text>{option.label}</Text>
                                </Flex>
                            ))}
                        </Column>

                        <Text bold>Valor de referencia:</Text>
                        <Flex gap={1} alignItems='center'>
                            <input
                                type='radio'
                                name='reference'
                                value={0}
                                checked={referenceType === 0}
                                onChange={e => setReferenceType(parseInt(e.target.value))}
                            />
                            <Text>Definir valor</Text>
                        </Flex>
                        {referenceType === 0 && (
                            <input
                                type='number'
                                className='form-control form-control-sm'
                                style={{ paddingLeft: '5px' }}
                                value={referenceValue}
                                onChange={e => setReferenceValue(parseInt(e.target.value) || 0)}
                            />
                        )}

                        <Flex gap={1} alignItems='center'>
                            <input
                                type='radio'
                                name='reference'
                                value={1}
                                checked={referenceType === 1}
                                onChange={e => setReferenceType(parseInt(e.target.value))}
                            />
                            <Text>A partir de la variable</Text>
                        </Flex>
                        {referenceType === 1 && (
                            <VariableSelectorComponent
                                selectedVariable={referenceVariable}
                                onVariableChange={setReferenceVariable}
                                targetType={referenceVarTargetType}
                                onTargetTypeChange={setReferenceVarTargetType}
                                typeOfAdvancedOption={referenceVarAdvancedOption}
                                onAdvancedOptionChange={setReferenceVarAdvancedOption}
                                label="Variable de referencia:"
                                showAdvancedOptions={true}
                                placeholder="-- Selecciona variable --"
                                showGlobal={true}
                                showTargetButtons={referenceType === 1}
                            />
                        )}
                    </>
                )}

            </Column>
        </WiredSelectorBaseView>
    );
};
