import { ConditionDefinition } from '@nitrots/nitro-renderer';
import { FC, useEffect, useMemo, useState } from 'react';
import { WIRED_STRING_DELIMETER, WiredFurniType } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { useNotification, useWired } from '../../../../hooks';
import { VariableSelectorComponent } from '../actions/components';
import { WiredConditionBaseView } from './WiredConditionBaseView';

const TARGET_FURNI = 0;
const TARGET_USER = 1;
const TARGET_GLOBAL = 2;

const USER_ACTIVATOR = 0;
const USER_SELECTOR = 1;
const USER_SIGNAL = 2;

const FURNI_FROM_TRIGGER = 3;
const FURNI_FROM_SELECTION = 4;
const FURNI_FROM_SELECTOR = 5;
const FURNI_FROM_SIGNAL = 6;

const VALUE_SOURCE_LITERAL = 0;
const VALUE_SOURCE_VARIABLE = 1;

const COMPARISON_GREATER = 0;
const COMPARISON_GREATER_EQUAL = 1;
const COMPARISON_EQUAL = 2;
const COMPARISON_LESS_EQUAL = 3;
const COMPARISON_LESS = 4;
const COMPARISON_NOT_EQUAL = 5;

const COMPARISON_OPTIONS = [
    { value: COMPARISON_GREATER, label: 'Mayor que', icon: '>' },
    { value: COMPARISON_GREATER_EQUAL, label: 'Mayor o igual', icon: '≥' },
    { value: COMPARISON_EQUAL, label: 'Igual', icon: '=' },
    { value: COMPARISON_LESS_EQUAL, label: 'Menor o igual', icon: '≤' },
    { value: COMPARISON_LESS, label: 'Menor que', icon: '<' },
    { value: COMPARISON_NOT_EQUAL, label: 'Desigual', icon: '≠' }
];

const CUSTOM_ALL_OR_ONE_TEXTS = [
    'Todos los objetivos cumplen',
    'Cualquiera de los objetivos cumple'
];

const normalizeTargetType = (value: number): number =>
{
    if(value === TARGET_USER || value === TARGET_GLOBAL) return value;
    return TARGET_FURNI;
};

const defaultAdvancedOption = (targetType: number): number =>
{
    if(targetType === TARGET_USER) return USER_ACTIVATOR;
    if(targetType === TARGET_GLOBAL) return 0;
    return FURNI_FROM_SELECTION;
};

const normalizeAdvancedOption = (targetType: number, option: number): number =>
{
    if(targetType === TARGET_USER) {
        return [ USER_ACTIVATOR, USER_SELECTOR, USER_SIGNAL ].includes(option) ? option : USER_ACTIVATOR;
    }

    if(targetType === TARGET_GLOBAL) {
        return 0;
    }

    return [ FURNI_FROM_TRIGGER, FURNI_FROM_SELECTION, FURNI_FROM_SELECTOR, FURNI_FROM_SIGNAL ].includes(option)
        ? option
        : FURNI_FROM_SELECTION;
};

const normalizeComparison = (value?: number | null): number =>
{
    const allowed = COMPARISON_OPTIONS.map(option => option.value);
    if(value !== undefined && value !== null && allowed.includes(value)) return value;
    return COMPARISON_EQUAL;
};

const normalizeValueSource = (value?: number | null): number =>
{
    return (value === VALUE_SOURCE_VARIABLE) ? VALUE_SOURCE_VARIABLE : VALUE_SOURCE_LITERAL;
};

const parseStoredStrings = (raw?: string | null): [string, string, string] =>
{
    if(!raw) return ['', '', ''];
    const parts = raw.split(WIRED_STRING_DELIMETER);
    return [ parts[0] || '', parts[1] || '', parts[2] || '' ];
};

export const WiredConditionVarValueMatchView: FC = () =>
{
    const { simpleAlert = null } = useNotification();
    const {
        trigger = null,
        setStringParam = null,
        setIntParams = null,
        setAllOrOneOptions = null
    } = useWired();

    const [variableName, setVariableName] = useState('');
    const [targetType, setTargetType] = useState(TARGET_FURNI);
    const [advancedOption, setAdvancedOption] = useState(defaultAdvancedOption(TARGET_FURNI));
    const [comparisonMode, setComparisonMode] = useState(COMPARISON_EQUAL);
    const [valueSource, setValueSource] = useState(VALUE_SOURCE_LITERAL);
    const [literalValue, setLiteralValue] = useState('');
    const [referenceVariable, setReferenceVariable] = useState('');
    const [referenceTargetType, setReferenceTargetType] = useState(TARGET_FURNI);
    const [referenceAdvancedOption, setReferenceAdvancedOption] = useState(defaultAdvancedOption(TARGET_FURNI));

    useEffect(() =>
    {
        const condition = trigger as ConditionDefinition | null;

        if(!condition)
        {
            setVariableName('');
            setReferenceVariable('');
            setLiteralValue('');
            setTargetType(TARGET_FURNI);
            setAdvancedOption(defaultAdvancedOption(TARGET_FURNI));
            setComparisonMode(COMPARISON_EQUAL);
            setValueSource(VALUE_SOURCE_LITERAL);
            setReferenceTargetType(TARGET_FURNI);
            setReferenceAdvancedOption(defaultAdvancedOption(TARGET_FURNI));
            if(setAllOrOneOptions) setAllOrOneOptions(1);
            return;
        }

        const [ storedVariable, storedReference, storedLiteral ] = parseStoredStrings(condition.stringData);
        setVariableName(storedVariable);
        setReferenceVariable(storedReference);
        setLiteralValue(storedLiteral || '');

        const storedTarget = condition.intData && condition.intData.length > 0 ? condition.intData[0] : TARGET_FURNI;
        const normalizedTarget = normalizeTargetType(storedTarget);
        setTargetType(normalizedTarget);

        const storedAdvanced = condition.intData && condition.intData.length > 1 ? condition.intData[1] : defaultAdvancedOption(normalizedTarget);
        setAdvancedOption(normalizeAdvancedOption(normalizedTarget, storedAdvanced));

        const storedComparison = condition.intData && condition.intData.length > 2 ? condition.intData[2] : COMPARISON_EQUAL;
        setComparisonMode(normalizeComparison(storedComparison));

        const storedValueSource = condition.intData && condition.intData.length > 3 ? condition.intData[3] : VALUE_SOURCE_LITERAL;
        setValueSource(normalizeValueSource(storedValueSource));

        const storedReferenceTarget = condition.intData && condition.intData.length > 4 ? condition.intData[4] : normalizedTarget;
        const normalizedReferenceTarget = normalizeTargetType(storedReferenceTarget);
        setReferenceTargetType(normalizedReferenceTarget);

        const storedReferenceAdvanced = condition.intData && condition.intData.length > 5 ? condition.intData[5] : defaultAdvancedOption(normalizedReferenceTarget);
        setReferenceAdvancedOption(normalizeAdvancedOption(normalizedReferenceTarget, storedReferenceAdvanced));

        if(setAllOrOneOptions && (!condition.allOrOneOptions || condition.allOrOneOptions === 0))
        {
            setAllOrOneOptions(1);
        }
    }, [ trigger?.id, setAllOrOneOptions ]);

    const notify = (message: string) =>
    {
        if(simpleAlert) simpleAlert(message);
        else alert(message);
    };

    const handleTargetTypeChange = (value: number) =>
    {
        const normalized = normalizeTargetType(value);
        setTargetType(normalized);
        setAdvancedOption(prev => normalizeAdvancedOption(normalized, prev));
        setVariableName('');
    };

    const handleReferenceTargetTypeChange = (value: number) =>
    {
        const normalized = normalizeTargetType(value);
        setReferenceTargetType(normalized);
        setReferenceAdvancedOption(prev => normalizeAdvancedOption(normalized, prev));
        setReferenceVariable('');
    };

    const handleLiteralChange = (value: string) =>
    {
        const sanitized = value.replace(/[^0-9-]/g, '');
        const normalized = sanitized.startsWith('-')
            ? ('-' + sanitized.slice(1).replace(/-/g, ''))
            : sanitized;
        setLiteralValue(normalized);
    };

    const save = () =>
    {
        if(!variableName)
        {
            notify('Selecciona la variable principal.');
            return;
        }

        if(valueSource === VALUE_SOURCE_LITERAL)
        {
            if(literalValue.trim().length === 0)
            {
                notify('Define un valor numérico para comparar.');
                return;
            }
        }
        else
        {
            if(!referenceVariable)
            {
                notify('Selecciona la variable de referencia.');
                return;
            }
        }

        const payload = [ variableName, referenceVariable, literalValue ].join(WIRED_STRING_DELIMETER);

        if(setStringParam) setStringParam(payload);
        if(setIntParams) setIntParams([
            targetType,
            normalizeAdvancedOption(targetType, advancedOption),
            comparisonMode,
            valueSource,
            referenceTargetType,
            normalizeAdvancedOption(referenceTargetType, referenceAdvancedOption)
        ]);
    };

    const comparisonDescription = useMemo(() =>
    {
        const option = COMPARISON_OPTIONS.find(opt => opt.value === comparisonMode);
        return option ? option.label : '';
    }, [ comparisonMode ]);

    return (
        <WiredConditionBaseView
            requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_BY_ID_OR_BY_TYPE }
            hasSpecialInput
            save={ save }
            allOrOne
            allOrOneFor={ 2 }
            customAllOrOneTexts={ CUSTOM_ALL_OR_ONE_TEXTS }>
            <Column gap={ 1 }>
                <Text bold>Variable objetivo</Text>
                <VariableSelectorComponent
                    selectedVariable={ variableName }
                    onVariableChange={ setVariableName }
                    targetType={ targetType }
                    onTargetTypeChange={ handleTargetTypeChange }
                    typeOfAdvancedOption={ advancedOption }
                    onAdvancedOptionChange={ option => setAdvancedOption(normalizeAdvancedOption(targetType, option)) }
                    label='Variable a evaluar'
                    showAdvancedOptions={ targetType !== TARGET_GLOBAL }
                    placeholder='-- Selecciona variable --'
                    showGlobal
                />

                <Column gap={ 1 }>
                    <Text bold>Escoge el tipo de comparación</Text>
                    <Flex gap={ 1 } alignItems='center' style={ { flexWrap: 'wrap' } }>
                        { COMPARISON_OPTIONS.map(option => {
                            const isActive = comparisonMode === option.value;

                            return (
                                <label
                                    key={ option.value }
                                    style={ {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.35rem 0.65rem',
                                        borderRadius: '6px',
                                        border: `1px solid ${isActive ? 'rgb(180, 139, 50)' : 'rgba(255, 255, 255, 0.2)'}`,
                                        backgroundColor: isActive ? 'rgba(180, 139, 50, 0.15)' : 'transparent',
                                        cursor: 'pointer'
                                    } }>
                                    <input
                                        className='form-check-input'
                                        type='radio'
                                        name='wfVarMatchComparison'
                                        checked={ isActive }
                                        onChange={ () => setComparisonMode(option.value) }
                                        style={ { margin: 0 } }
                                    />
                                    <Text bold style={ { fontSize: '1.25rem', lineHeight: 1 } }>
                                        { option.icon }
                                    </Text>
                                </label>
                            );
                        }) }
                    </Flex>
                </Column>

                <Column gap={ 1 }>
                    <Text bold>Origen del valor a comparar</Text>
                    <Flex gap={ 1 } alignItems='center'>
                        <input
                            className='form-check-input'
                            type='radio'
                            name='wfVarMatchValueSource'
                            checked={ valueSource === VALUE_SOURCE_LITERAL }
                            onChange={ () => setValueSource(VALUE_SOURCE_LITERAL) }
                        />
                        <Text>Definir valor</Text>
                    </Flex>
                    { valueSource === VALUE_SOURCE_LITERAL && (
                        <input
                            className='form-control form-control-sm'
                            type='text'
                            value={ literalValue }
                            onChange={ event => handleLiteralChange(event.target.value) }
                            placeholder='Ej. 10'
                        />
                    ) }

                    <Flex gap={ 1 } alignItems='center'>
                        <input
                            className='form-check-input'
                            type='radio'
                            name='wfVarMatchValueSource'
                            checked={ valueSource === VALUE_SOURCE_VARIABLE }
                            onChange={ () => setValueSource(VALUE_SOURCE_VARIABLE) }
                        />
                        <Text>A partir de otra variable</Text>
                    </Flex>
                    { valueSource === VALUE_SOURCE_VARIABLE && (
                        <VariableSelectorComponent
                            selectedVariable={ referenceVariable }
                            onVariableChange={ setReferenceVariable }
                            targetType={ referenceTargetType }
                            onTargetTypeChange={ handleReferenceTargetTypeChange }
                            typeOfAdvancedOption={ referenceAdvancedOption }
                            onAdvancedOptionChange={ option => setReferenceAdvancedOption(normalizeAdvancedOption(referenceTargetType, option)) }
                            label='Variable de referencia'
                            showAdvancedOptions={ referenceTargetType !== TARGET_GLOBAL }
                            placeholder='-- Selecciona variable --'
                            showGlobal
                            showTargetButtons
                        />
                    ) }
                </Column>

                <Text small>
                    La condición se cumple cuando el valor de la variable objetivo es { comparisonDescription.toLowerCase() } que el valor indicado.
                </Text>
            </Column>
        </WiredConditionBaseView>
    );
};
