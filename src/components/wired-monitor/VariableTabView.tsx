import { IContextVariableData } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/parser/room/variables/RoomContextVariablesMessageParser';
import { IFurniUserVariableData } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/parser/room/variables/RoomFurniVariablesMessageParser';
import { IGlobalUserVariableData } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/parser/room/variables/RoomGlobalVariablesMessageParser';
import { IInternalFurniVariableData } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/parser/room/variables/RoomInternalFurniVariablesMessageParser';
import { IInternalContextVariableData } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/parser/room/variables/RoomInternalContextVariablesMessageParser';
import { IInternalUserVariableData } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/parser/room/variables/RoomInternalUserVariablesMessageParser';
import { IUserUserVariableData } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/parser/room/variables/RoomUserVariablesMessageParser';
import { IInternalGlobalVariableData } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/parser/room/variables/RoomInternalGlobalVariablesMessageParser';
import { RoomFurniVariablesMessageEvent } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/room/variables/RoomFurniVariablesMessageEvent';
import { RoomInternalFurniVariablesMessageEvent } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/room/variables/RoomInternalFurniVariablesMessageEvent';
import { RoomContextVariablesMessageEvent } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/room/variables/RoomContextVariablesMessageEvent';
import { RoomInternalContextVariablesMessageEvent } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/room/variables/RoomInternalContextVariablesMessageEvent';
import { RoomInternalUserVariablesMessageEvent } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/room/variables/RoomInternalUserVariablesMessageEvent';
import { RoomUserVariablesMessageEvent } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/room/variables/RoomUserVariablesMessageEvent';
import { RoomGlobalVariablesMessageEvent } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/room/variables/RoomGlobalVariablesMessageEvent';
import { RoomInternalGlobalVariablesMessageEvent } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/room/variables/RoomInternalGlobalVariablesMessageEvent';
import { RequestFurniWithVariablesComposer } from '@nitrots/nitro-renderer/src/nitro/communication/messages/outgoing/room/variables/RequestFurniWithVariablesComposer';
import { RequestRoomVariablesComposer } from '@nitrots/nitro-renderer/src/nitro/communication/messages/outgoing/room/variables/RequestRoomVariablesComposer';
import { RequestUserVariablesComposer } from '@nitrots/nitro-renderer/src/nitro/communication/messages/outgoing/room/variables/RequestUserVariablesComposer';
import { RequestUserWithVariablesComposer } from '@nitrots/nitro-renderer/src/nitro/communication/messages/outgoing/room/variables/RequestUserWithVariablesComposer';
import { RequestGlobalVariablesComposer } from '@nitrots/nitro-renderer/src/nitro/communication/messages/outgoing/room/variables/RequestGlobalVariablesComposer';
import { RequestGlobalWithVariablesComposer } from '@nitrots/nitro-renderer/src/nitro/communication/messages/outgoing/room/variables/RequestGlobalWithVariablesComposer';
import { ToggleHighlightModeComposer } from '@nitrots/nitro-renderer/src/nitro/communication/messages/outgoing/room/variables/ToggleHighlightModeComposer';
import { FC, useEffect, useState } from 'react';
import { RequestContextVariablesComposer } from '@nitrots/nitro-renderer/src/nitro/communication/messages/outgoing/room/variables/RequestContextVariablesComposer';
import { SendMessageComposer } from '../../api';
import { Button, Flex, Text } from '../../common';
import { useMessageEvent } from '../../hooks/events';
import { useVariableHighlight } from '../../hooks/rooms/widgets/variables/useVariableHighlight';

interface IVariableHighlight {
    variableName: string;
    furniAssignments: any[];
    userAssignments: any[];
}

type VariableTarget = 'furni' | 'user' | 'global' | 'context';
type VariableOrigin = 'user' | 'internal';

type SelectedVariable = {
    target: VariableTarget;
    origin: VariableOrigin;
    var: IFurniUserVariableData | IInternalFurniVariableData | IUserUserVariableData | IInternalUserVariableData | IGlobalUserVariableData | IInternalGlobalVariableData | IContextVariableData | IInternalContextVariableData;
};

export const VariableTabView: FC<{}> = props => {
    const [userFurniVars, setUserFurniVars] = useState<IFurniUserVariableData[]>([]);
    const [internalFurniVars, setInternalFurniVars] = useState<IInternalFurniVariableData[]>([]);
    const [userUserVars, setUserUserVars] = useState<IUserUserVariableData[]>([]);
    const [internalUserVars, setInternalUserVars] = useState<IInternalUserVariableData[]>([]);
    const [userGlobalVars, setUserGlobalVars] = useState<IGlobalUserVariableData[]>([]);
    const [internalGlobalVars, setInternalGlobalVars] = useState<IInternalGlobalVariableData[]>([]);
    const [userContextVars, setUserContextVars] = useState<IContextVariableData[]>([]);
    const [internalContextVars, setInternalContextVars] = useState<IInternalContextVariableData[]>([]);
    const [selectedType, setSelectedType] = useState<VariableTarget>('furni');
    const [selected, setSelected] = useState<SelectedVariable | null>(null);
    const { activeHighlight, clearHighlights } = useVariableHighlight();

    const sortByCreationAsc = <T extends { creationTimestamp?: number }>(values: T[]) =>
        values.slice().sort((a, b) => ((a.creationTimestamp ?? 0) - (b.creationTimestamp ?? 0)));

    // Auto-select first variable when category changes or variables load
    useEffect(() => {
        if (selectedType === 'furni') {
            if (userFurniVars.length > 0) {
                setSelected({ target: 'furni', origin: 'user', var: userFurniVars[0] });
            } else if (internalFurniVars.length > 0) {
                setSelected({ target: 'furni', origin: 'internal', var: internalFurniVars[0] });
            }
        } else if (selectedType === 'user') {
            if (userUserVars.length > 0) {
                setSelected({ target: 'user', origin: 'user', var: userUserVars[0] });
            } else if (internalUserVars.length > 0) {
                setSelected({ target: 'user', origin: 'internal', var: internalUserVars[0] });
            }
        } else if (selectedType === 'global') {
            if (userGlobalVars.length > 0) {
                setSelected({ target: 'global', origin: 'user', var: userGlobalVars[0] });
            } else if (internalGlobalVars.length > 0) {
                setSelected({ target: 'global', origin: 'internal', var: internalGlobalVars[0] });
            }
        } else if (selectedType === 'context') {
            if (userContextVars.length > 0) {
                setSelected({ target: 'context', origin: 'user', var: userContextVars[0] });
            } else if (internalContextVars.length > 0) {
                setSelected({ target: 'context', origin: 'internal', var: internalContextVars[0] });
            }
        }
    }, [selectedType, userFurniVars, internalFurniVars, userUserVars, internalUserVars, userGlobalVars, internalGlobalVars, userContextVars, internalContextVars]);

    // Request variables once when tab mounts
    useEffect(() => {
        SendMessageComposer(new RequestRoomVariablesComposer());
        SendMessageComposer(new RequestUserVariablesComposer());
        SendMessageComposer(new RequestGlobalVariablesComposer());
        SendMessageComposer(new RequestContextVariablesComposer());
    }, []);

    // Clear highlights when selection changes to non-user or null
    // But don't clear if there's an active highlight for the same type (to prevent clearing during variable updates)
    useEffect(() => {
        if (!selected || selected.origin !== 'user' || selected.target === 'context') {
            if (activeHighlight) {
                const hasUserHighlight = activeHighlight.userAssignments && activeHighlight.userAssignments.length > 0;
                if (hasUserHighlight && (!selected || selected.origin === 'internal' || selected.target === 'context')) {
                    clearHighlights();
                    SendMessageComposer(new ToggleHighlightModeComposer(false));
                }
            } else {
                clearHighlights();
                SendMessageComposer(new ToggleHighlightModeComposer(false));
            }
        }
    }, [selected, clearHighlights, activeHighlight]);

    // Listen for user-created furni variables
    useMessageEvent<RoomFurniVariablesMessageEvent>(RoomFurniVariablesMessageEvent, event => {
        const parser = event.getParser();
        const list = parser.vars || [];
        const sorted = sortByCreationAsc(list);
        setUserFurniVars(sorted);
        setSelected(prev => {
            if (!prev || prev.target !== 'furni' || prev.origin !== 'user') return prev;
            const still = sorted.find(v => v.name === (prev.var as any).name);
            return still ? { target: 'furni', origin: 'user', var: still } : null;
        });
    });

    // Listen for internal furni variables
    useMessageEvent<RoomInternalFurniVariablesMessageEvent>(RoomInternalFurniVariablesMessageEvent, event => {
        const parser = event.getParser();
        const list = parser.vars || [];
        const sorted = sortByCreationAsc(list);
        setInternalFurniVars(sorted);
        setSelected(prev => {
            if (!prev || prev.target !== 'furni' || prev.origin !== 'internal') return prev;
            const still = sorted.find(v => v.name === (prev.var as any).name);
            return still ? { target: 'furni', origin: 'internal', var: still } : null;
        });
    });

    // Listen for user-created user variables
    useMessageEvent<RoomUserVariablesMessageEvent>(RoomUserVariablesMessageEvent, event => {
        const parser = event.getParser();
        const list = parser.vars || [];
        const sorted = sortByCreationAsc(list);
        setUserUserVars(sorted);
        setSelected(prev => {
            if (!prev || prev.target !== 'user' || prev.origin !== 'user') return prev;
            const still = sorted.find(v => v.name === (prev.var as any).name);
            return still ? { target: 'user', origin: 'user', var: still } : null;
        });
    });

    // Listen for internal user variables
    useMessageEvent<RoomInternalUserVariablesMessageEvent>(RoomInternalUserVariablesMessageEvent, event => {
        const parser = event.getParser();
        const list = parser.vars || [];
        const sorted = sortByCreationAsc(list);
        setInternalUserVars(sorted);
        setSelected(prev => {
            if (!prev || prev.target !== 'user' || prev.origin !== 'internal') return prev;
            const still = sorted.find(v => v.name === (prev.var as any).name);
            return still ? { target: 'user', origin: 'internal', var: still } : null;
        });
    });

    // Listen for user-created global variables
    useMessageEvent<RoomGlobalVariablesMessageEvent>(RoomGlobalVariablesMessageEvent, event => {
        const parser = event.getParser();
        const list = parser.vars || [];
        const sorted = sortByCreationAsc(list);
        setUserGlobalVars(sorted);
        setSelected(prev => {
            if (!prev || prev.target !== 'global' || prev.origin !== 'user') return prev;
            const still = sorted.find(v => v.name === (prev.var as any).name);
            return still ? { target: 'global', origin: 'user', var: still } : null;
        });
    });

    // Listen for internal global variables
    useMessageEvent<RoomInternalGlobalVariablesMessageEvent>(RoomInternalGlobalVariablesMessageEvent, event => {
        const parser = event.getParser();
        const list = parser.vars || [];
        const sorted = sortByCreationAsc(list);
        setInternalGlobalVars(sorted);
        setSelected(prev => {
            if (!prev || prev.target !== 'global' || prev.origin !== 'internal') return prev;
            const still = sorted.find(v => v.name === (prev.var as any).name);
            return still ? { target: 'global', origin: 'internal', var: still } : null;
        });
    });

    // Listen for user-created context variables
    useMessageEvent<RoomContextVariablesMessageEvent>(RoomContextVariablesMessageEvent, event => {
        const parser = event.getParser();
        const list = parser.vars || [];
        const sorted = sortByCreationAsc(list);
        setUserContextVars(sorted);
        setSelected(prev => {
            if (!prev || prev.target !== 'context' || prev.origin !== 'user') return prev;
            const still = sorted.find(v => v.name === (prev.var as any).name);
            return still ? { target: 'context', origin: 'user', var: still } : null;
        });
    });

    // Listen for internal context variables
    useMessageEvent<RoomInternalContextVariablesMessageEvent>(RoomInternalContextVariablesMessageEvent, event => {
        const parser = event.getParser();
        const list = parser.vars || [];
        const sorted = sortByCreationAsc(list);
        setInternalContextVars(sorted);
        setSelected(prev => {
            if (!prev || prev.target !== 'context' || prev.origin !== 'internal') return prev;
            const still = sorted.find(v => v.name === (prev.var as any).name);
            return still ? { target: 'context', origin: 'internal', var: still } : null;
        });
    });

    const highlightDisabled = !selected || selected.origin !== 'user' || selected.target === 'context';

    const handleToggleHighlight = () => {
        if (highlightDisabled || !selected) return;

        const variableName = (selected.var as IFurniUserVariableData | IUserUserVariableData | IGlobalUserVariableData).name;

        if (activeHighlight && activeHighlight.variableName === variableName) {
            clearHighlights();
            SendMessageComposer(new ToggleHighlightModeComposer(false));
            return;
        }

        if (activeHighlight) {
            clearHighlights();
            SendMessageComposer(new ToggleHighlightModeComposer(false));
        }

        SendMessageComposer(new ToggleHighlightModeComposer(true, variableName));

        if (selected.target === 'furni') {
            SendMessageComposer(new RequestFurniWithVariablesComposer(variableName));
        } else if (selected.target === 'user') {
            SendMessageComposer(new RequestUserWithVariablesComposer(variableName));
        } else if (selected.target === 'global') {
            SendMessageComposer(new RequestGlobalWithVariablesComposer(variableName));
        }
    };

    const handleClearHighlight = () => {
        clearHighlights();
        SendMessageComposer(new ToggleHighlightModeComposer(false));
    };

    // Determine button text based on current state
    const getHighlightButtonText = () => {
        if (!highlightDisabled && selected) {
            const variableName = (selected.var as IFurniUserVariableData | IUserUserVariableData | IGlobalUserVariableData).name;
            return (activeHighlight && activeHighlight.variableName === variableName)
                ? 'Eliminar Highlight'
                : 'Agregar Highlight';
        }
        return 'Agregar Highlight';
    };

    return (
        <>

            <Flex className='global-grid' style={{gap:"10px"}}>
                {/* Columna izquierda */}
                <Flex column className='w-50 bg-red' style={{ width: '100%' }}>
                    <Flex center column style={{ width: '100%' }}>
                        <Text className='text-left-container' >Variable type:</Text>
                    </Flex>
                    <Flex column style={{ width: '100%' }}>
                        <Flex center gap={3} className='container-buttons-var' style={{ width: '100%' }}>
                            <Flex center gap={3} className='container-buttons-var-inside'>
                                <Button active={selectedType === 'furni'} style={{ padding: "0" }} onClick={() => setSelectedType('furni')}>
                                    <i className={`button-var icon-furni-var ${selectedType === 'furni' ? 'selected' : ''}`}></i>
                                </Button>
                                <Button active={selectedType === 'user'} style={{ padding: "0" }} onClick={() => setSelectedType('user')}>
                                    <i className={`button-var icon-user-var ${selectedType === 'user' ? 'selected' : ''}`}></i>
                                </Button>
                                <Button active={selectedType === 'global'} style={{ padding: "0" }} onClick={() => setSelectedType('global')}>
                                    <i className={`button-var icon-global-var ${selectedType === 'global' ? 'selected' : ''}`}></i>
                                </Button>
                                <Button active={selectedType === 'context'} style={{ padding: "0" }} onClick={() => setSelectedType('context')}>
                                    <i className={`button-var icon-context-var ${selectedType === 'context' ? 'active' : ''}`}></i>
                                </Button>
                            </Flex>
                        </Flex>
                    </Flex>

                    <Flex column justifyContent='start' style={{ width: '100%' }}>
                        <Flex center column style={{ width: '100%' }}>
                            <Text style={{ marginBottom: "5px" }} className='text-left-container' >Variable picker:</Text>
                        </Flex>
                        <Flex center column style={{ width: '100%' }}>

                            <Flex className='container-var-selector' column>
                                {selectedType === 'furni' && userFurniVars.map((v, index) => (
                                    <Flex
                                        key={'fu-' + v.name + '-' + v.furniId}
                                        className={`button-var-picker ${selected && selected.target === 'furni' && selected.origin === 'user' && selected.var === v ? 'selected' : ''}`}
                                        style={{ cursor: 'pointer', backgroundColor: (selected && selected.target === 'furni' && selected.origin === 'user' && selected.var === v) ? '#b8e2fc' : (index % 2 === 0 ? 'white' : '#eaeaea') }}
                                        onClick={() => setSelected({ target: 'furni', origin: 'user', var: v })}
                                    >
                                        <Text small style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={v.name}>{v.name}</Text>
                                    </Flex>
                                ))}

                                {selectedType === 'furni' && internalFurniVars.map((v, index) => (
                                    <Flex
                                        key={'fi-' + v.name + '-' + v.furniId}
                                        className={`button-var-picker ${selected && selected.target === 'furni' && selected.origin === 'internal' && selected.var === v ? 'selected' : ''}`}
                                        style={{ cursor: 'pointer', backgroundColor: (selected && selected.target === 'furni' && selected.origin === 'internal' && selected.var === v) ? '#b8e2fc' : (index % 2 === 0 ? 'white' : '#eaeaea') }}
                                        onClick={() => setSelected({ target: 'furni', origin: 'internal', var: v })}
                                    >
                                        <Text small style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={v.name}>{v.name}</Text>
                                    </Flex>
                                ))}

                                {selectedType === 'user' && userUserVars.map((v, index) => (
                                    <Flex
                                        key={'uu-' + v.name + '-' + v.userId}
                                        className={`button-var-picker ${selected && selected.target === 'user' && selected.origin === 'user' && selected.var === v ? 'selected' : ''}`}
                                        style={{ cursor: 'pointer', backgroundColor: (selected && selected.target === 'user' && selected.origin === 'user' && selected.var === v) ? '#b8e2fc' : (index % 2 === 0 ? 'white' : '#eaeaea') }}
                                        onClick={() => setSelected({ target: 'user', origin: 'user', var: v })}
                                    >
                                        <Text small style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={v.name}>{v.name}</Text>
                                    </Flex>
                                ))}

                                {selectedType === 'user' && internalUserVars.map((v, index) => (
                                    <Flex
                                        key={'ui-' + v.name + '-' + v.userId}
                                        className={`button-var-picker ${selected && selected.target === 'user' && selected.origin === 'internal' && selected.var === v ? 'selected' : ''}`}
                                        style={{ cursor: 'pointer', backgroundColor: (selected && selected.target === 'user' && selected.origin === 'internal' && selected.var === v) ? '#b8e2fc' : (index % 2 === 0 ? 'white' : '#eaeaea') }}
                                        onClick={() => setSelected({ target: 'user', origin: 'internal', var: v })}
                                    >
                                        <Text small style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={v.name}>{v.name}</Text>
                                    </Flex>
                                ))}

                                {selectedType === 'global' && userGlobalVars.map((v, index) => (
                                    <Flex
                                        key={'ug-' + v.name}
                                        className={`button-var-picker ${selected && selected.target === 'global' && selected.origin === 'user' && selected.var === v ? 'selected' : ''}`}
                                        style={{ cursor: 'pointer', backgroundColor: (selected && selected.target === 'global' && selected.origin === 'user' && selected.var === v) ? '#b8e2fc' : (index % 2 === 0 ? 'white' : '#eaeaea') }}
                                        onClick={() => setSelected({ target: 'global', origin: 'user', var: v })}
                                    >
                                        <Text small style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={v.name}>{v.name}</Text>
                                    </Flex>
                                ))}

                                {selectedType === 'global' && internalGlobalVars.map((v, index) => (
                                    <Flex
                                        key={'ig-' + v.name}
                                        className={`button-var-picker ${selected && selected.target === 'global' && selected.origin === 'internal' && selected.var === v ? 'selected' : ''}`}
                                        style={{ cursor: 'pointer', backgroundColor: (selected && selected.target === 'global' && selected.origin === 'internal' && selected.var === v) ? '#b8e2fc' : (index % 2 === 0 ? 'white' : '#eaeaea') }}
                                        onClick={() => setSelected({ target: 'global', origin: 'internal', var: v })}
                                    >
                                        <Text small style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={v.name}>{v.name}</Text>
                                    </Flex>
                                ))}

                                {selectedType === 'context' && userContextVars.map((v, index) => (
                                    <Flex
                                        key={'cu-' + v.name + '-' + v.furniId}
                                        className={`button-var-picker ${selected && selected.target === 'context' && selected.origin === 'user' && selected.var === v ? 'selected' : ''}`}
                                        style={{ cursor: 'pointer', backgroundColor: (selected && selected.target === 'context' && selected.origin === 'user' && selected.var === v) ? '#b8e2fc' : (index % 2 === 0 ? 'white' : '#eaeaea') }}
                                        onClick={() => setSelected({ target: 'context', origin: 'user', var: v })}
                                    >
                                        <Text small style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={v.name}>{v.name}</Text>
                                    </Flex>
                                ))}

                                {selectedType === 'context' && internalContextVars.map((v, index) => (
                                    <Flex
                                        key={'ci-' + v.name + '-' + v.furniId}
                                        className={`button-var-picker ${selected && selected.target === 'context' && selected.origin === 'internal' && selected.var === v ? 'selected' : ''}`}
                                        style={{  cursor: 'pointer', backgroundColor: (selected && selected.target === 'context' && selected.origin === 'internal' && selected.var === v) ? '#b8e2fc' : (index % 2 === 0 ? 'white' : '#eaeaea') }}
                                        onClick={() => setSelected({ target: 'context', origin: 'internal', var: v })}
                                    >
                                        <Text small style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={v.name}>{v.name}</Text>
                                    </Flex>
                                ))}
                            </Flex>
                        </Flex>
                    </Flex>
                    <Flex column justifyContent='start' style={{ width: '100%' }}>
                        <Flex center column style={{ width: '100%', marginTop: "10px" }}>
                            <Flex className='text-left-container'>
                                <Button

                                    onClick={handleToggleHighlight}
                                    disabled={highlightDisabled}
                                >
                                    {getHighlightButtonText()}
                                </Button>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>

                {/* Columna derecha */}
                <Flex column className='w-50 bg-blue' style={{ width: '100%' }}>
                    <Flex style={{ marginBottom: "10px" }}><Text>Properties</Text>
                    </Flex>
                    <Flex className='container-values-prop'>
                        <div className='grid-container-props'>
                            <div style={{ backgroundColor: "#f9f9f9", borderBottom: "1px solid #bfbfbf", gridTemplateColumns: '1fr 20px 1fr' }} className='grid-container2-props'>
                                <Text style={{ marginLeft: "4px" }} bold>Property</Text>
                                <div></div>
                                <Text bold>Value</Text>
                            </div>

                            {!selected && (
                                <div className='grid-container2-props' style={{ marginTop: "10px", gridTemplateColumns: '1fr 20px 1fr' }}>
                                    <Text>-</Text>
                                    <div></div>
                                    <Text>Selecciona una variable...</Text>
                                </div>
                            )}

                            {selected && (() => {
                                const v: any = selected.var;
                                const isInternal = selected.origin === 'internal';
                                const yn = (b: boolean | undefined) => b ? 'Yes' : 'No';
                                const formatTimestamp = (value?: number) => value ? new Date(value).toLocaleString() : '-';
                                const targetLabel = selected.target === 'furni' ? 'Furni' : selected.target === 'user' ? 'User' : selected.target === 'global' ? 'Global' : 'Context';

                                const availability = v.availability || '/';
                                const hasValue = !!v.hasValue;
                                const canWriteTo = !!v.canWriteTo;
                                const canCreateDelete = !!v.canCreateDelete;
                                const isAlwaysAvailable = !!v.isAlwaysAvailable;
                                const hasCreationTime = !!v.hasCreationTime;
                                const hasUpdateTime = !!v.hasUpdateTime;
                                const isTextConnected = !!v.isTextConnected;
                                const runtimeValue = v.hasRuntimeValue ? v.runtimeValue : (hasValue ? v.runtimeValue : undefined);
                                const creationTimestamp = formatTimestamp(v.creationTimestamp);
                                const updateTimestamp = formatTimestamp(v.updateTimestamp);

                                return (
                                    <>
                                        <div className='grid-container2-props' style={{ backgroundColor: 'white', gridTemplateColumns: '1fr 20px 1fr' }}>
                                            <Text style={{ marginLeft: "4px" }}>Name</Text><div></div><Text style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={v.name}>{v.name}</Text>
                                        </div>
                                        <div className='grid-container2-props' style={{ backgroundColor: '#eaeaea', gridTemplateColumns: '1fr 20px 1fr' }}>
                                            <Text style={{ marginLeft: "4px" }}>Type</Text><div></div><Text>{isInternal ? 'Internal' : 'Created by User'}</Text>
                                        </div>
                                        <div className='grid-container2-props' style={{ backgroundColor: 'white', gridTemplateColumns: '1fr 20px 1fr' }}>
                                            <Text style={{ marginLeft: "4px" }}>Target</Text><div></div><Text>{targetLabel}</Text>
                                        </div>
                                        <div className='grid-container2-props' style={{ backgroundColor: '#eaeaea', gridTemplateColumns: '1fr 20px 1fr' }}>
                                            <Text style={{ marginLeft: "4px" }}>Availability</Text><div></div><Text>{availability === 'while_room_active' ? 'While user is in room' : availability}</Text>
                                        </div>
                                        <div className='grid-container2-props' style={{ backgroundColor: 'white', gridTemplateColumns: '1fr 20px 1fr' }}>
                                            <Text style={{ marginLeft: "4px" }}>Has value</Text><div></div><Text>{yn(hasValue)}</Text>
                                        </div>
                                        <div className='grid-container2-props' style={{ backgroundColor: '#eaeaea', gridTemplateColumns: '1fr 20px 1fr' }}>
                                            <Text style={{ marginLeft: "4px" }}>Can write to</Text><div></div><Text>{yn(canWriteTo)}</Text>
                                        </div>
                                        <div className='grid-container2-props' style={{ backgroundColor: 'white', gridTemplateColumns: '1fr 20px 1fr' }}>
                                            <Text style={{ marginLeft: "4px" }}>Can create/delete</Text><div></div><Text>{yn(canCreateDelete)}</Text>
                                        </div>
                                        <div className='grid-container2-props' style={{ backgroundColor: '#eaeaea', gridTemplateColumns: '1fr 20px 1fr' }}>
                                            <Text style={{ marginLeft: "4px" }}>Is always available</Text><div></div><Text>{yn(isAlwaysAvailable)}</Text>
                                        </div>
                                        <div className='grid-container2-props' style={{ backgroundColor: 'white', gridTemplateColumns: '1fr 20px 1fr' }}>
                                            <Text style={{ marginLeft: "4px" }}>Has creation time</Text><div></div><Text>{yn(hasCreationTime)}</Text>
                                        </div>
                                        <div className='grid-container2-props' style={{ backgroundColor: '#eaeaea', gridTemplateColumns: '1fr 20px 1fr' }}>
                                            <Text style={{ marginLeft: "4px" }}>Has update time</Text><div></div><Text>{yn(hasUpdateTime)}</Text>
                                        </div>
                                        <div className='grid-container2-props' style={{ backgroundColor: 'white', gridTemplateColumns: '1fr 20px 1fr' }}>
                                            <Text style={{ marginLeft: "4px" }}>Is text connected</Text><div></div><Text>{yn(isTextConnected)}</Text>
                                        </div>
                                        <div className='grid-container2-props' style={{ backgroundColor: '#eaeaea', gridTemplateColumns: '1fr 20px 1fr' }}>
                                            <Text style={{ marginLeft: "4px" }}>Created at</Text><div></div><Text style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={creationTimestamp}>{creationTimestamp}</Text>
                                        </div>
                                        <div className='grid-container2-props' style={{ backgroundColor: 'white', gridTemplateColumns: '1fr 20px 1fr' }}>
                                            <Text style={{ marginLeft: "4px" }}>Updated at</Text><div></div><Text style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={updateTimestamp}>{updateTimestamp}</Text>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </Flex>

                    <Flex style={{ marginTop: "10px" }}><Text>Text values:</Text></Flex>
                    <Flex className='container-values-prop' style={{ height: "140px", marginTop: "10px", overflowY: 'auto', marginBottom: "18px" }}>
                        {(() => {
                            if (!selected) {
                                return (
                                    <Text style={{ padding: '10px', width: '100%' }}>
                                        Selecciona una variable para consultar los textos conectados.
                                    </Text>
                                );
                            }

                            const variable: any = selected.var;
                            const isTextConnected = !!variable?.isTextConnected;
                            const supportsTexts = selected.origin === 'user' || selected.origin === 'internal';

                            if (!supportsTexts) {
                                return (
                                    <Text style={{ padding: '10px', width: '100%' }}>
                                        Esta variable no soporta textos conectados.
                                    </Text>
                                );
                            }

                            if (!isTextConnected) {
                                return (
                                    <Flex column style={{ width: '100%', backgroundColor:"#ffffffff" }}>
                                    <Flex style={{ backgroundColor: '#ffffffff', padding: "3px", borderBottom: "1px solid #bfbfbf" }} className=''>
                                        <Text style={{ marginLeft: "4px" }} bold>Value</Text>
                                        <Text bold style={{ marginLeft: 'auto', marginRight: '4px' }} >Text</Text>
                                    </Flex>
                                    
                                </Flex>
                                );
                            }

                            const entries = Array.isArray(variable.textEntries) ? [...variable.textEntries] : [];
                            entries.sort((a, b) => a.index - b.index);

                            if (!entries.length) {
                                return (
                                    <Flex column style={{ width: '100%', backgroundColor:"#ffffffff" }}>
                                    <Flex style={{ backgroundColor: '#ffffffff', padding: "3px", borderBottom: "1px solid #bfbfbf" }} className=''>
                                        <Text style={{ marginLeft: "4px" }} bold>Value</Text>
                                        <Text bold style={{ marginLeft: 'auto', marginRight: '4px' }} >Text</Text>
                                    </Flex>
                                    
                                </Flex>
                                );
                            }

                            return (
                                <Flex column style={{ backgroundColor:"#ffffffff", width: '100%' }}>
                                    <Flex style={{ backgroundColor: '#f9f9f9', padding: "3px", borderBottom: "1px solid #bfbfbf" }} className=''>
                                        <Text style={{ marginLeft: "4px" }} bold>Value</Text>
                                        <Text bold style={{ marginLeft: 'auto', marginRight: '4px' }} >Text</Text>
                                    </Flex>
                                    {entries.map((entry, index) => (
                                        <Flex key={entry.index} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#eaeaea', padding: "3px" }} className=''>
                                            <Text style={{ marginLeft: "4px" }}  >{entry.index}</Text>
                                            <Text style={{ marginLeft: 'auto', marginRight: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={entry.text}>{entry.text}</Text>
                                        </Flex>
                                    ))}
                                </Flex>
                            );
                        })()}
                    </Flex>
                </Flex>
            </Flex></>


    );
}
