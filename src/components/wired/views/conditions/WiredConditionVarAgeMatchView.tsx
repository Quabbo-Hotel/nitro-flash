import { ConditionDefinition } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { WiredFurniType } from '../../../../api';
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

const AGE_SOURCE_CREATED = 0;
const AGE_SOURCE_UPDATED = 1;

const COMPARISON_LESS = 0;
const COMPARISON_GREATER = 1;

const UNIT_MILLISECONDS = 0;
const UNIT_SECONDS = 1;
const UNIT_MINUTES = 2;
const UNIT_HOURS = 3;
const UNIT_DAYS = 4;
const UNIT_MONTHS = 5;
const UNIT_YEARS = 6;

const TIME_UNIT_OPTIONS = [
    { value: UNIT_MILLISECONDS, label: 'Milisegundos' },
    { value: UNIT_SECONDS, label: 'Segundos' },
    { value: UNIT_MINUTES, label: 'Minutos' },
    { value: UNIT_HOURS, label: 'Horas' },
    { value: UNIT_DAYS, label: 'Dias' },
    { value: UNIT_MONTHS, label: 'Meses' },
    { value: UNIT_YEARS, label: 'Anios' }
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
    if(targetType === TARGET_USER)
    {
        return [ USER_ACTIVATOR, USER_SELECTOR, USER_SIGNAL ].includes(option) ? option : USER_ACTIVATOR;
    }

    if(targetType === TARGET_GLOBAL)
    {
        return 0;
    }

    return [ FURNI_FROM_TRIGGER, FURNI_FROM_SELECTION, FURNI_FROM_SELECTOR, FURNI_FROM_SIGNAL ].includes(option)
        ? option
        : FURNI_FROM_SELECTION;
};

const normalizeComparison = (value?: number | null): number =>
{
    return value === COMPARISON_LESS ? COMPARISON_LESS : COMPARISON_GREATER;
};

const normalizeAgeSource = (value?: number | null): number =>
{
    return value === AGE_SOURCE_UPDATED ? AGE_SOURCE_UPDATED : AGE_SOURCE_CREATED;
};

const sanitizeDurationValue = (value?: number | null): number =>
{
    if(!value || value <= 0) return 1;
    return value;
};

const normalizeDurationUnit = (value?: number | null): number =>
{
    const allowed = TIME_UNIT_OPTIONS.map(option => option.value);
    if(value !== undefined && value !== null && allowed.includes(value)) return value;
    return UNIT_SECONDS;
};

export const WiredConditionVarAgeMatchView: FC = () =>
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
    const [ageSource, setAgeSource] = useState(AGE_SOURCE_CREATED);
    const [comparisonMode, setComparisonMode] = useState(COMPARISON_GREATER);
    const [durationValue, setDurationValue] = useState(1);
    const [durationUnit, setDurationUnit] = useState(UNIT_SECONDS);

    useEffect(() =>
    {
        const condition = trigger as ConditionDefinition | null;

        if(!condition)
        {
            setVariableName('');
            setTargetType(TARGET_FURNI);
            setAdvancedOption(defaultAdvancedOption(TARGET_FURNI));
            setAgeSource(AGE_SOURCE_CREATED);
            setComparisonMode(COMPARISON_GREATER);
            setDurationValue(1);
            setDurationUnit(UNIT_SECONDS);
            if(setAllOrOneOptions) setAllOrOneOptions(1);
            return;
        }

        setVariableName(condition.stringData || '');

        const data = condition.intData || [];
        const storedTarget = data.length > 0 ? data[0] : TARGET_FURNI;
        const normalizedTarget = normalizeTargetType(storedTarget);
        setTargetType(normalizedTarget);

        const storedAdvanced = data.length > 1 ? data[1] : defaultAdvancedOption(normalizedTarget);
        setAdvancedOption(normalizeAdvancedOption(normalizedTarget, storedAdvanced));

        const storedAgeSource = data.length > 2 ? data[2] : AGE_SOURCE_CREATED;
        setAgeSource(normalizeAgeSource(storedAgeSource));

        const storedComparison = data.length > 3 ? data[3] : COMPARISON_GREATER;
        setComparisonMode(normalizeComparison(storedComparison));

        const storedDurationValue = data.length > 4 ? data[4] : 1;
        setDurationValue(sanitizeDurationValue(storedDurationValue));

        const storedDurationUnit = data.length > 5 ? data[5] : UNIT_SECONDS;
        setDurationUnit(normalizeDurationUnit(storedDurationUnit));

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

    const handleDurationValueChange = (value: string) =>
    {
        const sanitized = value.replace(/[^0-9]/g, '');
        setDurationValue(sanitized.length ? parseInt(sanitized, 10) : 0);
    };

    const save = () =>
    {
        if(!variableName)
        {
            notify('Selecciona la variable.');
            return;
        }

        if(durationValue <= 0)
        {
            notify('La duración debe ser un número mayor a 0.');
            return;
        }

        if(setStringParam) setStringParam(variableName);
        if(setIntParams) setIntParams([
            targetType,
            normalizeAdvancedOption(targetType, advancedOption),
            ageSource,
            comparisonMode,
            sanitizeDurationValue(durationValue),
            normalizeDurationUnit(durationUnit)
        ]);
    };

    return (
        <WiredConditionBaseView
            requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_BY_ID_OR_BY_TYPE }
            hasSpecialInput
            save={ save }
            allOrOne
            allOrOneFor={ 2 }>
            <Column gap={ 1 }>
                <VariableSelectorComponent
                    selectedVariable={ variableName }
                    onVariableChange={ setVariableName }
                    targetType={ targetType }
                    onTargetTypeChange={ handleTargetTypeChange }
                    typeOfAdvancedOption={ advancedOption }
                    onAdvancedOptionChange={ option => setAdvancedOption(normalizeAdvancedOption(targetType, option)) }
                    showAdvancedOptions={ targetType !== TARGET_GLOBAL }
                    showGlobal
                    placeholder='-- variable --'
                />

                <Column gap={ 0.5 }>
                    <Text bold>Comparar valor</Text>
                    <Flex gap={ 1 } alignItems='center'>
                        <input
                            className='form-check-input'
                            type='radio'
                            name='wfVarAgeSource'
                            checked={ ageSource === AGE_SOURCE_CREATED }
                            onChange={ () => setAgeSource(AGE_SOURCE_CREATED) }
                        />
                        <Text>Fecha de creación</Text>
                    </Flex>
                    <Flex gap={ 1 } alignItems='center'>
                        <input
                            className='form-check-input'
                            type='radio'
                            name='wfVarAgeSource'
                            checked={ ageSource === AGE_SOURCE_UPDATED }
                            onChange={ () => setAgeSource(AGE_SOURCE_UPDATED) }
                        />
                        <Text>Fecha de última modificación</Text>
                    </Flex>
                </Column>

                <Column gap={ 0.5 }>
                    <Text bold>Escoge el tipo</Text>
                    <Flex gap={ 2 }>
                        <label style={ { display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' } }>
                            <input
                                className='form-check-input'
                                type='radio'
                                name='wfVarAgeComparison'
                                checked={ comparisonMode === COMPARISON_LESS }
                                onChange={ () => setComparisonMode(COMPARISON_LESS) }
                            />
                            <Text>&lt; Menor que</Text>
                        </label>
                        <label style={ { display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' } }>
                            <input
                                className='form-check-input'
                                type='radio'
                                name='wfVarAgeComparison'
                                checked={ comparisonMode === COMPARISON_GREATER }
                                onChange={ () => setComparisonMode(COMPARISON_GREATER) }
                            />
                            <Text>&gt; Mayor que</Text>
                        </label>
                    </Flex>
                </Column>

                <Column gap={ 0.5 }>
                    <Text bold>Seleccionar tiempo</Text>
                    <Flex gap={ 1 } alignItems='center'>
                        <input
                            className='form-control form-control-sm'
                            type='text'
                            value={ durationValue }
                            onChange={ event => handleDurationValueChange(event.target.value) }
                            style={ { maxWidth: '6rem' } }
                        />
                        <select
                            className='form-select form-select-sm'
                            value={ durationUnit }
                            onChange={ event => setDurationUnit(normalizeDurationUnit(parseInt(event.target.value, 10))) }
                            style={ { maxWidth: '10rem' } }>
                            { TIME_UNIT_OPTIONS.map(option => (
                                <option key={ option.value } value={ option.value }>{ option.label }</option>
                            )) }
                        </select>
                    </Flex>
                </Column>
            </Column>
        </WiredConditionBaseView>
    );
};
