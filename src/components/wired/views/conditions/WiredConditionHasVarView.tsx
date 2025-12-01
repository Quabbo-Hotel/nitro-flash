import { ConditionDefinition } from '@nitrots/nitro-renderer';
import { FC, useEffect, useMemo, useState } from 'react';
import { WiredFurniType } from '../../../../api';
import { Column, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { VariableSelectorComponent } from '../actions/components';
import { WiredConditionBaseView } from './WiredConditionBaseView';

const CUSTOM_ALL_OR_ONE_TEXTS = [
    'Todas las variables corresponden',
    'Cualquiera de las variables corresponde'
];

const normalizeTargetType = (value: number): number =>
{
    if(value === 1 || value === 2) return value;
    return 0;
};

const defaultAdvancedOption = (targetType: number): number =>
{
    if(targetType === 1) return 0;
    if(targetType === 2) return 0;
    return 4;
};

const normalizeAdvancedOption = (targetType: number, option: number): number =>
{
    if(targetType === 1) return [0, 1, 2].includes(option) ? option : 0;
    if(targetType === 2) return 0;
    return [3, 4, 5, 6].includes(option) ? option : 4;
};

interface WiredConditionHasVarTemplateProps
{
    negated: boolean;
}

const WiredConditionHasVarTemplate: FC<WiredConditionHasVarTemplateProps> = ({ negated }) =>
{
    const {
        trigger = null,
        setStringParam = null,
        setIntParams = null,
        setAllOrOneOptions = null
    } = useWired();

    const [selectedVariable, setSelectedVariable] = useState('');
    const [targetType, setTargetType] = useState(0);
    const [advancedOption, setAdvancedOption] = useState(defaultAdvancedOption(0));

    useEffect(() =>
    {
        const condition = trigger as ConditionDefinition | null;

        if(!condition)
        {
            setSelectedVariable('');
            setTargetType(0);
            setAdvancedOption(defaultAdvancedOption(0));
            if(setAllOrOneOptions) setAllOrOneOptions(1);
            return;
        }

        setSelectedVariable(condition.stringData || '');

        const storedTarget = condition.intData && condition.intData.length > 0 ? condition.intData[0] : 0;
        const normalizedTarget = normalizeTargetType(storedTarget);
        setTargetType(normalizedTarget);

        const storedOption = condition.intData && condition.intData.length > 1 ? condition.intData[1] : defaultAdvancedOption(normalizedTarget);
        const normalizedOption = normalizeAdvancedOption(normalizedTarget, storedOption);
        setAdvancedOption(normalizedOption);

        if(setAllOrOneOptions && (!condition.allOrOneOptions || condition.allOrOneOptions === 0))
        {
            setAllOrOneOptions(1);
        }
    }, [ trigger?.id, setAllOrOneOptions ]);

    const handleTargetTypeChange = (value: number) =>
    {
        const normalized = normalizeTargetType(value);
        setTargetType(normalized);
        setAdvancedOption(prev => normalizeAdvancedOption(normalized, prev));
        setSelectedVariable('');
    };

    const helperText = useMemo(() =>
    {
        if(negated)
        {
            return 'La condición se cumple si los objetivos seleccionados NO tienen la variable indicada.';
        }

        return 'La condición se cumple si los objetivos seleccionados tienen la variable indicada.';
    }, [ negated ]);

    const save = () =>
    {
        if(setStringParam) setStringParam(selectedVariable || '');
        if(setIntParams) setIntParams([ targetType, normalizeAdvancedOption(targetType, advancedOption) ]); // int[0] = targetType, int[1] = advancedOption
    };

    return (
        <WiredConditionBaseView
            requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_BY_ID_OR_BY_TYPE }
            hasSpecialInput
            save={ save }
            allOrOne
            allOrOneFor={ 2 }
            customAllOrOneTexts={ CUSTOM_ALL_OR_ONE_TEXTS }>
            <Column gap={ 1 }>
                <VariableSelectorComponent
                    selectedVariable={ selectedVariable }
                    onVariableChange={ setSelectedVariable }
                    targetType={ targetType }
                    onTargetTypeChange={ handleTargetTypeChange }
                    typeOfAdvancedOption={ advancedOption }
                    onAdvancedOptionChange={ option => setAdvancedOption(normalizeAdvancedOption(targetType, option)) }
                    label='Variable a comprobar:'
                    showAdvancedOptions={ targetType !== 2 }
                    placeholder='-- Selecciona variable --'
                    showGlobal
                />

                <Text small>{ helperText }</Text>
                { !selectedVariable && <Text small>Selecciona una variable para guardar la configuración.</Text> }
            </Column>
        </WiredConditionBaseView>
    );
};

export const WiredConditionHasVarView: FC = () => <WiredConditionHasVarTemplate negated={ false } />;

export const WiredConditionNegHasVarView: FC = () => <WiredConditionHasVarTemplate negated />;
