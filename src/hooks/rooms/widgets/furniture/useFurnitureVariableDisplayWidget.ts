import { FurniWithVariablesMessageEvent } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/room/variables/FurniWithVariablesMessageEvent';
import { useEffect, useState } from 'react';
import { useMessageEvent } from '../../../events';
import { setClearFurniDisplayDataCallback } from '../variables/useVariableHighlight';

const useFurnitureVariableDisplayWidgetState = () => {
    const [displayData, setDisplayData] = useState<Map<number, { variableName: string, value: number | null, label: string }>>(new Map());

    // Function to clear display data
    const clearDisplayData = () => {
        setDisplayData(new Map());
    };

    // Register the clear function
    useEffect(() => {
        setClearFurniDisplayDataCallback(clearDisplayData);
    }, []);

    useMessageEvent<FurniWithVariablesMessageEvent>(FurniWithVariablesMessageEvent, event => {
        const parser = event.getParser();
        
        const newDisplayData = new Map<number, { variableName: string, value: number | null, label: string }>();

        parser.assignments.forEach(assignment => {
            newDisplayData.set(assignment.virtualId, {
                variableName: parser.variableName,
                value: assignment.value,
                label: assignment.label
            });
        });

        setDisplayData(newDisplayData);
    });

    return { displayData, clearDisplayData };
};

export const useFurnitureVariableDisplayWidget = useFurnitureVariableDisplayWidgetState;
