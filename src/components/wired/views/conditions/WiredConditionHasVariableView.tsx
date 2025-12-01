import { FC, useEffect, useMemo, useState } from 'react';
import { Column, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredFurniType } from '../../../../api';
import { SendMessageComposer } from '../../../../api';
import { RequestRoomVariablesComposer } from '@nitrots/nitro-renderer/src/nitro/communication/messages/outgoing/room/variables/RequestRoomVariablesComposer';
import { useMessageEvent } from '../../../../hooks/events';
import { RoomFurniVariablesMessageEvent } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/room/variables/RoomFurniVariablesMessageEvent';
import { IFurniUserVariableData } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/parser/room/variables/RoomFurniVariablesMessageParser';
import { WiredConditionBaseView } from './WiredConditionBaseView';

// View para condición HAS_VARIABLE (interface 29)
// stringData = nombre de variable
// Usa allOrOne toggle del base (requiresFurni selección por id)

export const WiredConditionHasVariableView: FC = () => {
    const { trigger = null, setStringParam = null } = useWired();
    const [ variables, setVariables ] = useState<IFurniUserVariableData[]>([]);
    const [ selected, setSelected ] = useState('');
    // Cache global compartida con la acción
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const g: any = globalThis as any;
    if(!g.__wiredRoomVarsCache) g.__wiredRoomVarsCache = { list: null as IFurniUserVariableData[] | null };

    useEffect(() => {
        if(g.__wiredRoomVarsCache.list) {
            setVariables(g.__wiredRoomVarsCache.list);
        } else {
            SendMessageComposer(new RequestRoomVariablesComposer());
        }
    }, []);

    useEffect(() => {
        if(trigger) setSelected(trigger.stringData || '');
    }, [ trigger?.id ]);

    useMessageEvent<RoomFurniVariablesMessageEvent>(RoomFurniVariablesMessageEvent, event => {
        const parser = event.getParser();
        const incoming: IFurniUserVariableData[] = parser.vars || [];
        const old: IFurniUserVariableData[] = g.__wiredRoomVarsCache.list || [];
        const buildSig = (arr: IFurniUserVariableData[]) => arr.map(v => `${v.name}|${v.hasValue?'1':'0'}|${v.permanent?'1':'0'}|${v.availability}`).join('#');
        const newSig = buildSig(incoming);
        const oldSig = g.__wiredRoomVarsCache.sig || '';
        if(newSig === oldSig) return;
        g.__wiredRoomVarsCache.list = incoming;
        g.__wiredRoomVarsCache.sig = newSig;
        setVariables(incoming);
        if(selected) {
            const sel = incoming.find(v => v.name === selected);
            if(!sel) setSelected(''); // desapareció
        }
    });

    const optionElements = useMemo(() => {
        const MAX = 500;
        const list = variables.length > MAX ? variables.slice(0, MAX) : variables;
        return list.map(v => <option key={ v.name } value={ v.name }>{ v.name }</option>);
    }, [variables]);

    const save = () => setStringParam(selected || '');

    return (
        <WiredConditionBaseView
            requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_BY_ID }
            hasSpecialInput={ true }
            save={ save }
            allOrOne
            allOrOneFor={ 1 }>
            <Column gap={ 1 }>
                <Text bold>Variable a comprobar</Text>
                <select className='form-select' value={ selected } onChange={ e => setSelected(e.target.value) }>
                    <option value=''>-- Selecciona variable --</option>
                    { optionElements }
                    { variables.length > 500 && <option disabled>... ({ variables.length - 500 } más ocultas)</option> }
                </select>
                { !selected && <Text small>Selecciona una variable creada con el addon de variable.</Text> }
            </Column>
        </WiredConditionBaseView>
    );
};
