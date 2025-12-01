import { FC, useEffect, useMemo, useState } from 'react';
import { WIRED_STRING_DELIMETER } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { useNotification, useWired } from '../../../../hooks';
import { WiredAddonBaseView } from './WiredAddonBaseView';

const DEFAULT_PLACEHOLDER_WORD = 'aquiloqueponga';
const DEFAULT_DELIMITER = ', ';
const USER_SOURCE_OPTIONS = [
    { value: 0, label: 'Usuario Accionador', icon: 'icon-neighbor-0' },
    { value: 1, label: 'Usuario de Selector', icon: 'icon-neighbor-5' },
    { value: 2, label: 'Usuario de Senal', icon: 'icon-neighbor-2' }
];

export const WiredAddonTextOutputUsernameView: FC = () =>
{
    const { simpleAlert = null } = useNotification();
    const { trigger = null, setIntParams = null, setStringParam = null } = useWired();
    const [placeholder, setPlaceholder] = useState('');
    const [mode, setMode] = useState(0);
    const [delimiter, setDelimiter] = useState(DEFAULT_DELIMITER);
    const [userSource, setUserSource] = useState(0);

    useEffect(() =>
    {
        if (!trigger) return;

        const rawStrings = (trigger.stringData || '').split(WIRED_STRING_DELIMETER);
        const storedPlaceholder = rawStrings[0] || '';
        const storedDelimiter = rawStrings[1] || DEFAULT_DELIMITER;

        setPlaceholder(stripWrapper(storedPlaceholder));
        setDelimiter(storedDelimiter.slice(0, 5));

        const intData = trigger.intData || [];
        setMode((intData[0] === 1) ? 1 : 0);
        setUserSource(USER_SOURCE_OPTIONS.some(option => option.value === intData[1]) ? intData[1] : 0);
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

        const normalizedDelimiter = (delimiter || '').slice(0, 5);

        if (mode === 1)
        {
            if (normalizedDelimiter.trim().length === 0)
            {
                notify('El delimitador debe tener entre 1 y 5 caracteres.');
                return;
            }
        }

        const storedPlaceholder = `$(${normalizedPlaceholder})`;

        setStringParam(`${storedPlaceholder}${WIRED_STRING_DELIMETER}${normalizedDelimiter}`);
        setIntParams([mode, userSource]);
    };

    const displayPlaceholder = useMemo(() =>
    {
        if (placeholder && placeholder.length)
        {
            return `$(${placeholder})`;
        }

        return `$(${DEFAULT_PLACEHOLDER_WORD})`;
    }, [placeholder]);

    const userSourceLabel = useMemo(() =>
    {
        return USER_SOURCE_OPTIONS.find(option => option.value === userSource)?.label || USER_SOURCE_OPTIONS[0].label;
    }, [userSource]);

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
                    <Text bold>Formato de salida</Text>
                    <Flex gap={1} alignItems="center">
                        <input
                            className="form-check-input"
                            type="radio"
                            id="wfTextOutputSingle"
                            name="wfTextOutputMode"
                            checked={(mode === 0)}
                            onChange={() => setMode(0)} />
                        <Text>Unico</Text>
                    </Flex>
                    <Flex gap={1} alignItems="center">
                        <input
                            className="form-check-input"
                            type="radio"
                            id="wfTextOutputMultiple"
                            name="wfTextOutputMode"
                            checked={(mode === 1)}
                            onChange={() => setMode(1)} />
                        <Text>Multiples</Text>
                    </Flex>
                    {(mode === 1) &&
                        <Column gap={0}>
                            <Text small>Delimitador (1 a 5 caracteres)</Text>
                            <input
                                className="form-control form-control-sm"
                                type="text"
                                maxLength={5}
                                value={delimiter}
                                onChange={event => setDelimiter(event.target.value)}
                                placeholder={DEFAULT_DELIMITER} />
                        </Column>}
                </Column>

                <Column gap={1}>
                    <Text bold>Obtener entidad</Text>
                    <div className="align-advancedoptionsone">
                        <div className="button-group">
                            {USER_SOURCE_OPTIONS.map(option =>
                            {
                                const isSelected = (userSource === option.value);

                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => setUserSource(option.value)}
                                        className={`${option.icon} ${isSelected ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`} />
                                );
                            })}
                        </div>
                    </div>
                    <Text style={{ textAlign: 'center' }}>{userSourceLabel}</Text>
                </Column>
            </Column>
        </WiredAddonBaseView>
    );
};
