/**
 * VariableSelectorComponent - Componente reutilizable para selección de variables
 * 
 * Colores por tipo de variable:
 * - Furni: rgb(186, 152, 22) - Dorado/Amarillo
 * - User: rgb(38, 142, 41) - Verde
 * - Global: rgb(131, 29, 141) - Púrpura
 * - Context: rgb(176, 94, 30) - Naranja/Marrón
 * 
 * Efectos visuales:
 * - Hover: Brillo aumentado (brightness(1.3)) + drop-shadow
 * - Seleccionado: Brillo base (brightness(1.1)) + drop-shadow
 * - Transiciones suaves de 0.3s
 * - Escalado ligero (scale(1.05)) en hover
 */

import { RoomFurniVariablesMessageEvent } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/room/variables/RoomFurniVariablesMessageEvent';
import { RoomInternalFurniVariablesMessageEvent } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/room/variables/RoomInternalFurniVariablesMessageEvent';
import { RoomInternalUserVariablesMessageEvent } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/room/variables/RoomInternalUserVariablesMessageEvent';
import { RoomUserVariablesMessageEvent } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/room/variables/RoomUserVariablesMessageEvent';
import { RoomGlobalVariablesMessageEvent } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/room/variables/RoomGlobalVariablesMessageEvent';
import { RoomInternalGlobalVariablesMessageEvent } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/room/variables/RoomInternalGlobalVariablesMessageEvent';
import { RequestRoomVariablesComposer } from '@nitrots/nitro-renderer/src/nitro/communication/messages/outgoing/room/variables/RequestRoomVariablesComposer';
import { RequestUserVariablesComposer } from '@nitrots/nitro-renderer/src/nitro/communication/messages/outgoing/room/variables/RequestUserVariablesComposer';
import { RequestGlobalVariablesComposer } from '@nitrots/nitro-renderer/src/nitro/communication/messages/outgoing/room/variables/RequestGlobalVariablesComposer';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { SendMessageComposer } from '../../../../../api';
import { Column, Flex, Text } from '../../../../../common';
import { useMessageEvent } from '../../../../../hooks/events';

interface VariableSelectorComponentProps {
    selectedVariable: string;
    onVariableChange: (variable: string) => void;
    targetType: number; // 0 = furni (rgb(186, 152, 22)), 1 = user (rgb(38, 142, 41)), 2 = global (rgb(131, 29, 141)), 3 = context (rgb(176, 94, 30))
    onTargetTypeChange: (targetType: number) => void;
    typeOfAdvancedOption: number;
    onAdvancedOptionChange: (option: number) => void;
    label?: string;
    showAdvancedOptions?: boolean;
    placeholder?: string;
    showInternal?: boolean; // whether to show internal variables
    showOnlyWithValue?: boolean; // whether to show only variables that have value
    filterType?: 'userCreated' | 'hasValue';
    showGlobal?: boolean; // whether to show global variables option
    showTargetButtons?: boolean; // whether to show the target type buttons
}

export const VariableSelectorComponent: FC<VariableSelectorComponentProps> = ({
    selectedVariable,
    onVariableChange,
    targetType,
    onTargetTypeChange,
    typeOfAdvancedOption,
    onAdvancedOptionChange,
    label = 'Selecciona una variable:',
    showAdvancedOptions = true,
    placeholder = '-- variable --',
    showInternal = true,
    showOnlyWithValue = false,
    filterType,
    showGlobal = true,
    showTargetButtons = true
}) => {
    const varsRef = useRef({
        user: [] as any[],
        furni: [] as any[],
        userInternal: [] as any[],
        userUser: [] as any[],
        global: [] as any[],
        internalGlobal: [] as any[]
    });

    const [varsVersion, setVarsVersion] = useState(0);

    const sortByCreationAsc = <T extends { creationTimestamp?: number }>(values: T[]) =>
        values.slice().sort((a, b) => ((a.creationTimestamp ?? 0) - (b.creationTimestamp ?? 0)));

    // Pedir variables solo una vez
    useEffect(() => {
        SendMessageComposer(new RequestRoomVariablesComposer());
        SendMessageComposer(new RequestUserVariablesComposer());
        SendMessageComposer(new RequestGlobalVariablesComposer());
    }, []);

    // Cachear sin re-render inmediato
    const scheduleRefresh = useRef<NodeJS.Timeout | null>(null);
    const triggerRefresh = () => {
        if (scheduleRefresh.current) return;
        scheduleRefresh.current = setTimeout(() => {
            scheduleRefresh.current = null;
            setVarsVersion(v => v + 1);
        }, 300);
    };

    useMessageEvent(RoomFurniVariablesMessageEvent, ev => {
        const vars = (ev.parser as any).vars as any[];
        varsRef.current.user = sortByCreationAsc(vars || []);
        triggerRefresh();
    });

    useMessageEvent(RoomInternalFurniVariablesMessageEvent, ev => {
        varsRef.current.furni = (ev.parser as any).vars;
        triggerRefresh();
    });

    useMessageEvent(RoomInternalUserVariablesMessageEvent, ev => {
        varsRef.current.userInternal = (ev.parser as any).vars;
        triggerRefresh();
    });

    useMessageEvent(RoomUserVariablesMessageEvent, ev => {
        const vars = (ev.parser as any).vars as any[];
        varsRef.current.userUser = sortByCreationAsc(vars || []);
        triggerRefresh();
    });

    useMessageEvent(RoomGlobalVariablesMessageEvent, ev => {
        const vars = (ev.parser as any).vars as any[];
        varsRef.current.global = sortByCreationAsc(vars || []);
        triggerRefresh();
    });

    useMessageEvent(RoomInternalGlobalVariablesMessageEvent, ev => {
        varsRef.current.internalGlobal = (ev.parser as any).vars;
        triggerRefresh();
    });

    // Lista visible (solo recalcula cuando varsVersion cambia)
    const selectableVars = useMemo(() => {
        const items: any[] = [];
        const { user, furni, userInternal, userUser, global, internalGlobal } = varsRef.current;

        if (targetType === 0) {
            user.forEach((v: any) => {
                v.display = v.name;
                items.push(v);
            });
            if (showInternal) {
                furni.forEach((v: any) => {
                    const dup = items.some(it => it.name === v.name);
                    v.display = dup ? `${v.name} (int)` : v.name;
                    v.hasValue = true; // internal variables have value
                    items.push(v);
                });
            }
        } else if (targetType === 1) {
            userInternal.forEach((v: any) => {
                v.display = v.name;
                v.hasValue = true; // internal variables have value
                items.push(v);
            });
            userUser.forEach((v: any) => {
                v.display = v.name;
                items.push(v);
            });
        } else if (targetType === 2) {
            global.forEach((v: any) => {
                v.display = v.name;
                items.push(v);
            });
            if (showInternal) {
                internalGlobal.forEach((v: any) => {
                    const dup = items.some(it => it.name === v.name);
                    v.display = dup ? `${v.name} (int)` : v.name;
                    v.hasValue = true; // internal variables have value
                    items.push(v);
                });
            }
        }

        const userCreated = items.filter(i => i.canCreateDelete);
        const internals = items.filter(i => !i.canCreateDelete).sort((a: any, b: any) => a.name.localeCompare(b.name));
        items.length = 0;
        items.push(...userCreated);
        items.push(...internals);

        let filtered = items;

        if (filterType === 'userCreated') {
            filtered = items.filter(v => v.canCreateDelete);
        } else if (filterType === 'hasValue') {
            filtered = items.filter(v => v.hasValue && v.canWriteTo);
        }

        return filtered;
    }, [targetType, varsVersion, showInternal, filterType]);

    const selectedDef = useMemo(() => selectableVars.find(v => v.name === selectedVariable), [selectedVariable, selectableVars]);

    const handleVariableChange = (value: string) => {
        onVariableChange(value);
    };

    const getAdvancedOptionLabel = (option: number) => {
        const labels = [
            'Usuario Accionador',
            'Usuarios de Selector',
            'Usuarios de Señal',
            'Item Desencadenante',
            'Items seleccionados',
            'Items de selector',
            'Items de Señal'
        ];
        return labels[option] || '';
    };

    return (
        <Column gap={1}>
            <Flex className='red'>
                <Flex gap={1} alignItems='center'>
                    <Text bold>{label}</Text>
                </Flex>
                {showTargetButtons && (
                    <Flex className='container-buttons-var'>
                        <i 
                            className="button-icon icon-var-furni" 
                            style={{ 
                                backgroundColor: targetType === 0 ? 'rgb(186, 152, 22)' : 'transparent',
                                transition: 'all 0.2s ease'
                            }} 
                            
                            onClick={() => onTargetTypeChange(0)} 
                        />
                        <i 
                            className="button-icon icon-var-user" 
                            style={{ 
                                backgroundColor: targetType === 1 ? 'rgb(38, 142, 41)' : 'transparent',
                                transition: 'all 0.2s ease'
                            }} 
                            
                            onClick={() => onTargetTypeChange(1)} 
                        />
                        {showGlobal && (
                            <i 
                                className="button-icon icon-var-global" 
                                style={{ 
                                    backgroundColor: targetType === 2 ? 'rgb(131, 29, 141)' : 'transparent',
                                    transition: 'all 0.2s ease'
                                }}
                                
                                onClick={() => onTargetTypeChange(2)}
                            />
                        )}
                        <i 
                            className="button-icon icon-var-context" 
                            style={{ 
                                backgroundColor: targetType === 3 ? 'rgb(176, 94, 30)' : 'transparent',
                                transition: 'all 0.2s ease'
                            }}
                            
                            onClick={() => onTargetTypeChange(3)}
                        />
                    </Flex>
                )}
            </Flex>

            <select
                className='form-select'
                style={{ width: '100%', appearance: 'menulist', paddingLeft: '5px' }}
                value={selectedVariable}
                onChange={e => handleVariableChange(e.target.value)}
            >
                <option value=''>{placeholder}</option>
                {selectableVars.map(v => (
                    <option key={v.name} value={v.name}>{v.display || v.name}</option>
                ))}
            </select>

            {showAdvancedOptions && targetType !== 2 && (
                <>
                    <Text bold>Opciones avanzadas</Text>
                    <div className='align-advancedoptionsone'>
                        {targetType === 1 ? (
                            <div className="button-group">
                                <button
                                    onClick={() => onAdvancedOptionChange(0)}
                                    className={` icon-neighbor-3 ${typeOfAdvancedOption === 0 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`}
                                    
                                />
                                <button
                                    onClick={() => onAdvancedOptionChange(1)}
                                    className={` icon-neighbor-5 ${typeOfAdvancedOption === 1 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`}
                                    
                                />
                                <button
                                    onClick={() => onAdvancedOptionChange(2)}
                                    className={` icon-neighbor-2 ${typeOfAdvancedOption === 2 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`}
                                    
                                />
                            </div>
                        ) : (
                            <div className="button-group">
                                <button
                                    onClick={() => onAdvancedOptionChange(3)}
                                    className={` icon-neighbor-3 ${typeOfAdvancedOption === 3 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`}
                                    
                                />
                                <button
                                    onClick={() => onAdvancedOptionChange(4)}
                                    className={` icon-neighbor-1 ${typeOfAdvancedOption === 4 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`}
                                    
                                />
                                <button
                                    onClick={() => onAdvancedOptionChange(5)}
                                    className={` icon-neighbor-5 ${typeOfAdvancedOption === 5 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`}
                                    
                                />
                                <button
                                    onClick={() => onAdvancedOptionChange(6)}
                                    className={` icon-neighbor-2 ${typeOfAdvancedOption === 6 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`}
                                    
                                />
                            </div>
                        )}
                    </div>

                    {typeOfAdvancedOption !== undefined && (
                        <Text style={{ textAlign: "center" }}>
                            {getAdvancedOptionLabel(typeOfAdvancedOption)}
                        </Text>
                    )}
                </>
            )}
        </Column>
    );
};
