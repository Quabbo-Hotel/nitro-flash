import { FC, useEffect, useState } from 'react';
import { WiredFurniType } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { VariableSelectorComponent } from '../actions/components';
import { WiredTriggerBaseView } from './WiredTriggerBaseView';

const EVENT_OPTIONS = [
    { bit: 1, label: 'Creacion de variable' },
    { bit: 2, label: 'Valor modificado' },
    { bit: 8, label: 'Variable eliminada' }
];

const VALUE_SUB_OPTIONS = [
    { bit: 1 << 4, label: 'Aumenta (nuevo > antiguo)' },
    { bit: 1 << 5, label: 'Disminuye (nuevo < antiguo)' },
    { bit: 1 << 6, label: 'Permanece igual' }
];

export const WiredTriggerVariableEventView: FC = () => {
    const { trigger = null, setStringParam = null, setIntParams = null } = useWired();

    const [selectedVariable, setSelectedVariable] = useState('');
    const [targetType, setTargetType] = useState(0);
    const [eventMask, setEventMask] = useState(15);
    const [advancedOption, setAdvancedOption] = useState(0);

    useEffect(() => {
        if (!trigger) return;

        setSelectedVariable(trigger.stringData || '');
        const storedTarget = (trigger.intData.length > 0) ? trigger.intData[0] : 0;
        setTargetType(storedTarget);

        const storedMask = (trigger.intData.length > 1) ? trigger.intData[1] : 15;
        setEventMask(storedMask > 0 ? storedMask : 15);

        const storedAdvanced = (trigger.intData.length > 2) ? trigger.intData[2] : 0;
        setAdvancedOption(storedAdvanced);
    }, [trigger?.id]);

    useEffect(() => {
        if (targetType === 3) {
            setSelectedVariable('');
        }
    }, [targetType]);

    const toggleMaskBit = (bit: number) => {
        setEventMask(prev => {
            const hasBit = (prev & bit) !== 0;
            return hasBit ? (prev & ~bit) : (prev | bit);
        });
    };

    const save = () => {
        const variableFilter = (targetType === 3) ? '' : selectedVariable;
        setStringParam(variableFilter || '');
    setIntParams([targetType, eventMask, advancedOption]);
    };

    return (
        <WiredTriggerBaseView
            requiresFurni={WiredFurniType.STUFF_SELECTION_OPTION_NONE}
            hasSpecialInput
            save={save}
        >
            <Column gap={1}>
                <VariableSelectorComponent
                    selectedVariable={selectedVariable}
                    onVariableChange={setSelectedVariable}
                    targetType={targetType}
                    onTargetTypeChange={setTargetType}
                    typeOfAdvancedOption={advancedOption}
                    onAdvancedOptionChange={setAdvancedOption}
                    label="Variable objetivo (opcional):"
                    showAdvancedOptions={false}
                    placeholder="-- cualquiera --"
                    showInternal
                />

                {targetType === 3 && (
                    <Text small>Para variables de contexto no es necesario seleccionar un nombre: se escucharan todos los eventos del proceso.</Text>
                )}

                <Column gap={1}>
                    <Text bold>Selecciona los eventos que disparan el trigger:</Text>
                    {EVENT_OPTIONS.map(option => (
                            <Flex key={option.bit} gap={1} alignItems="center">
                                <input
                                    type="checkbox"
                                    checked={(eventMask & option.bit) !== 0}
                                    onChange={() => toggleMaskBit(option.bit)}
                                />
                                <Text>{option.label}</Text>
                            </Flex>
                        ))}

                        {/* When 'Valor modificado' (bit 2) is selected, show sub-options */}
                        {(eventMask & 2) !== 0 && (
                            <div style={{ paddingLeft: 12 }}>
                                <Text small>Filtrar por tipo de cambio:</Text>
                                {VALUE_SUB_OPTIONS.map(opt => (
                                    <Flex key={opt.bit} gap={1} alignItems="center">
                                        <input type="checkbox" checked={(eventMask & opt.bit) !== 0} onChange={() => toggleMaskBit(opt.bit)} />
                                        <Text>{opt.label}</Text>
                                    </Flex>
                                ))}
                                <Text small>Si no seleccionas ninguna opción de cambio concreto, cualquier cambio de valor activará el trigger.</Text>
                            </div>
                        )}
                    {eventMask === 0 && (
                        <Text small>Selecciona al menos un evento para que el trigger pueda activarse.</Text>
                    )}
                </Column>
            </Column>
        </WiredTriggerBaseView>
    );
};
