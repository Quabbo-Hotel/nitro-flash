import { FC, useEffect, useMemo, useState, ChangeEvent } from 'react';
import { Column, Flex, Text } from '../../../../common';
import { WiredAddonBaseView } from './WiredAddonBaseView';
import { useWired } from '../../../../hooks';

const MAX_LINES = 25;

export const WiredAddonVariableTextView: FC = () => {
    const { trigger = null, setStringParam = null } = useWired();
    const [editorValue, setEditorValue] = useState('');

    const normalizeInput = (value: string) => value.replace(/\r/g, '');

    const clampLines = (value: string) => {
        const normalized = normalizeInput(value);
        const lines = normalized.split('\n');
        if (lines.length <= MAX_LINES) return normalized;
        return lines.slice(0, MAX_LINES).join('\n');
    };

    useEffect(() => {
        const initial = trigger?.stringData || '';
        setEditorValue(clampLines(initial));
    }, [trigger]);

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setEditorValue(clampLines(event.target.value));
    };

    const save = () => setStringParam(editorValue);

    const currentLineCount = useMemo(() => {
        if (!editorValue.length) return 0;
        return editorValue.split('\n').length;
    }, [editorValue]);

    return (
        <WiredAddonBaseView hasSpecialInput save={save} requiresFurni={0}>
            <Column gap={1}>
                <Text bold>Mapa de textos conectados</Text>
                <Text small>
                    Escribe hasta { MAX_LINES } líneas usando el formato <b>numero=texto</b>. Cada número corresponde al valor que recibirá el addon de variable.
                </Text>
                <textarea
                    className='form-var-text'
                    rows={8}
                    spellCheck={false}
                    value={editorValue}
                    onChange={handleChange}
                />
                <Flex>
                    <Text small>{ currentLineCount } / { MAX_LINES } líneas</Text>
                    <Text small>Ejemplo: 1=Hola mundo</Text>
                </Flex>
            </Column>
        </WiredAddonBaseView>
    );
};
