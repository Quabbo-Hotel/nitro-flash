import { FC, useEffect, useMemo, useState } from 'react';
import { WIRED_STRING_DELIMETER } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { useNotification, useWired } from '../../../../hooks';
import { VariableSelectorComponent } from '../actions/components/VariableSelectorComponent';
import { WiredAddonBaseView } from './WiredAddonBaseView';

const DEFAULT_PLACEHOLDER_WORD = 'variable';
const DEFAULT_DELIMITER = ', ';
const MAX_DELIMITER_LENGTH = 5;
const MODE_MULTIPLE = 1;
const FORMAT_TEXT = 1;
const TARGET_FURNI = 0;
const TARGET_USER = 1;
const TARGET_GLOBAL = 2;
const TARGET_CONTEXT = 3;
const SOURCE_NONE = -1;
const SORT_SELECTION_ORDER = 2;
const SORT_ASCENDING = 0;
const SORT_DESCENDING = 1;

export const WiredAddonTextOutputVariableView: FC = () =>
{
    const { simpleAlert = null } = useNotification();
    const { trigger = null, setIntParams = null, setStringParam = null } = useWired();
    const [placeholder, setPlaceholder] = useState('');
    const [variableName, setVariableName] = useState('');
    const [targetType, setTargetType] = useState(TARGET_USER);
    const [sourceOption, setSourceOption] = useState(0);
    const [mode, setMode] = useState(0);
    const [delimiter, setDelimiter] = useState(DEFAULT_DELIMITER);
    const [formatMode, setFormatMode] = useState(0);
    const [sortMode, setSortMode] = useState(SORT_SELECTION_ORDER);

    const sanitizeTargetType = (value: number) =>
    {
        switch (value)
        {
            case TARGET_FURNI:
            case TARGET_USER:
            case TARGET_GLOBAL:
            case TARGET_CONTEXT:
                return value;
            default:
                return TARGET_USER;
        }
    };

    const normalizeSourceForTarget = (target: number, value?: number | null) =>
    {
        if (target === TARGET_USER)
        {
            if (value === 1 || value === 2) return value;
            return 0;
        }

        if (target === TARGET_FURNI || target === TARGET_CONTEXT)
        {
            if (value !== undefined && value !== null && value >= 3 && value <= 6) return value;
            return 5;
        }

        return SOURCE_NONE;
    };

    useEffect(() =>
    {
        if (!trigger) return;

        const rawStrings = (trigger.stringData || '').split(WIRED_STRING_DELIMETER);
        const storedPlaceholder = rawStrings[0] || '';
        const storedDelimiter = rawStrings[1] || DEFAULT_DELIMITER;
        const storedVariable = rawStrings[2] || '';

        setPlaceholder(stripWrapper(storedPlaceholder));
        setDelimiter((storedDelimiter || DEFAULT_DELIMITER).slice(0, MAX_DELIMITER_LENGTH));
        setVariableName(storedVariable);

        const intData = trigger.intData || [];

        const resolveSortMode = (value?: number | null) =>
        {
            if (value === SORT_SELECTION_ORDER || value === SORT_ASCENDING || value === SORT_DESCENDING) return value;
            if (value === undefined || value === null) return SORT_SELECTION_ORDER;
            if (value === 1) return SORT_DESCENDING;
            return SORT_ASCENDING;
        };

        if (intData.length >= 5)
        {
            const storedTarget = sanitizeTargetType(intData[0]);
            setTargetType(storedTarget);
            setMode((intData[1] === MODE_MULTIPLE) ? MODE_MULTIPLE : 0);
            setFormatMode((intData[2] === FORMAT_TEXT) ? FORMAT_TEXT : 0);
            setSortMode(resolveSortMode(intData[3]));
            setSourceOption(normalizeSourceForTarget(storedTarget, intData[4]));
            return;
        }

        setTargetType(TARGET_USER);
        setMode((intData[0] === MODE_MULTIPLE) ? MODE_MULTIPLE : 0);
        setFormatMode((intData[2] === FORMAT_TEXT) ? FORMAT_TEXT : 0);
        setSortMode(resolveSortMode(intData[3]));
    }, [trigger]);

    const notify = (message: string) =>
    {
        if (simpleAlert) simpleAlert(message);
        else alert(message);
    };

    const stripWrapper = (value: string) =>
    {
        if (!value) return '';

        let sanitized = value.trim();

        if (sanitized.startsWith('$(')) sanitized = sanitized.slice(2);
        if (sanitized.endsWith(')')) sanitized = sanitized.slice(0, -1);

        return sanitized.trim();
    };

    const save = () =>
    {
        const normalizedPlaceholder = stripWrapper(placeholder);

        if (!normalizedPlaceholder.length)
        {
            notify('Debes definir un identificador (solo la palabra, sin $( ) ).');
            return;
        }

        if (!variableName.length)
        {
            notify('Selecciona una variable.');
            return;
        }

        const normalizedDelimiter = (delimiter || '').slice(0, MAX_DELIMITER_LENGTH);

        if (mode === MODE_MULTIPLE)
        {
            if (normalizedDelimiter.trim().length === 0)
            {
                notify('El delimitador debe tener entre 1 y 5 caracteres.');
                return;
            }
        }

        const storedPlaceholder = `$(${normalizedPlaceholder})`;
        const payload = [storedPlaceholder, normalizedDelimiter, variableName].join(WIRED_STRING_DELIMETER);

        setStringParam(payload);
        setIntParams([
            targetType,
            mode,
            formatMode,
            sortMode,
            normalizeSourceForTarget(targetType, sourceOption)
        ]);
    };

    const handleTargetTypeChange = (value: number) =>
    {
        const sanitized = sanitizeTargetType(value);
        setTargetType(sanitized);
        setSourceOption(prev => normalizeSourceForTarget(sanitized, prev));
    };

    const displayPlaceholder = useMemo(() =>
    {
        if (placeholder && placeholder.length)
        {
            return `$(${placeholder})`;
        }

        return `$(${DEFAULT_PLACEHOLDER_WORD})`;
    }, [placeholder]);

    return (
        <WiredAddonBaseView hasSpecialInput={true} save={save} requiresFurni={0}>
            <Column gap={1}>
                <Column gap={1}>
                    <Text bold>Identificador a reemplazar</Text>
                    <input
                        className="form-control form-control-sm"
                        type="text"
                        value={placeholder}
                        onChange={event => setPlaceholder(event.target.value)}
                        placeholder={DEFAULT_PLACEHOLDER_WORD} />
                </Column>
                <Text>
                    Escribe solo la palabra. Se insertará como <span style={{ color: 'rgb(133, 133, 17)', fontWeight: 600 }}>{displayPlaceholder}</span> en el texto del wired.
                </Text>

                <Column gap={1}>
                    <VariableSelectorComponent
                        selectedVariable={variableName}
                        onVariableChange={setVariableName}
                        targetType={targetType}
                        onTargetTypeChange={handleTargetTypeChange}
                        typeOfAdvancedOption={sourceOption}
                        onAdvancedOptionChange={value => setSourceOption(normalizeSourceForTarget(targetType, value))}
                        showAdvancedOptions={(targetType !== TARGET_GLOBAL)}
                        showGlobal={true}
                        showTargetButtons={true}
                        placeholder="-- variable --" />
                    
                </Column>

                <Column gap={1}>
                    <Text bold>Formato del valor</Text>
                    <Column gap={1}>
                        <Flex gap={1} alignItems="center">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="wfTextOutputVariableNumeric"
                                name="wfTextOutputVariableFormat"
                                checked={(formatMode === 0)}
                                onChange={() => setFormatMode(0)} />
                            <Text>Valor numerico</Text>
                        </Flex>
                        {(formatMode !== FORMAT_TEXT) &&
                            <Column gap={1} style={{ marginLeft: '1.5rem' }}>
                                
                                <Flex gap={1} alignItems="center">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        id="wfTextOutputVariableSelectionOrder"
                                        name="wfTextOutputVariableOrder"
                                        checked={(sortMode === SORT_SELECTION_ORDER)}
                                        onChange={() => setSortMode(SORT_SELECTION_ORDER)} />
                                    <Text>Orden de selección</Text>
                                </Flex>
                                <Flex gap={1} alignItems="center">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        id="wfTextOutputVariableAsc"
                                        name="wfTextOutputVariableOrder"
                                        checked={(sortMode === SORT_ASCENDING)}
                                        onChange={() => setSortMode(SORT_ASCENDING)} />
                                    <Text>Creciente</Text>
                                </Flex>
                                <Flex gap={1} alignItems="center">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        id="wfTextOutputVariableDesc"
                                        name="wfTextOutputVariableOrder"
                                        checked={(sortMode === SORT_DESCENDING)}
                                        onChange={() => setSortMode(SORT_DESCENDING)} />
                                    <Text>Descendente</Text>
                                </Flex>
                            </Column>}
                    </Column>
                    <Flex gap={1} alignItems="center">
                        <input
                            className="form-check-input"
                            type="radio"
                            id="wfTextOutputVariableText"
                            name="wfTextOutputVariableFormat"
                            checked={(formatMode === FORMAT_TEXT)}
                            onChange={() => setFormatMode(FORMAT_TEXT)} />
                        <Text>Texto conectado</Text>
                    </Flex>
                </Column>

                <Column gap={1}>
                    <Text bold>Cantidad de resultados</Text>
                    <Flex gap={1} alignItems="center">
                        <input
                            className="form-check-input"
                            type="radio"
                            id="wfTextOutputVariableSingle"
                            name="wfTextOutputVariableMode"
                            checked={(mode === 0)}
                            onChange={() => setMode(0)} />
                        <Text>Unico</Text>
                    </Flex>
                    <Flex gap={1} alignItems="center">
                        <input
                            className="form-check-input"
                            type="radio"
                            id="wfTextOutputVariableMultiple"
                            name="wfTextOutputVariableMode"
                            checked={(mode === MODE_MULTIPLE)}
                            onChange={() => setMode(MODE_MULTIPLE)} />
                        <Text>Multiples</Text>
                    </Flex>
                    {(mode === MODE_MULTIPLE) &&
                        <Column gap={0}>
                            <Text small>Delimitador (1 a 5 caracteres)</Text>
                            <input
                                className="form-control form-control-sm"
                                type="text"
                                maxLength={MAX_DELIMITER_LENGTH}
                                value={delimiter}
                                onChange={event => setDelimiter(event.target.value)}
                                placeholder={DEFAULT_DELIMITER} />
                        </Column>}
                </Column>

            </Column>
        </WiredAddonBaseView>
    );
};
