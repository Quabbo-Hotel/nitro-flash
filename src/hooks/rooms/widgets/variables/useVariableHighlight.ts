import { IFurniVariableAssignmentData } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/parser/room/variables/FurniWithVariablesMessageParser';
import { IUserVariableAssignmentData } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/parser/room/variables/UserWithVariablesMessageParser';
import { FurniWithVariablesMessageEvent } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/room/variables/FurniWithVariablesMessageEvent';
import { UserWithVariablesMessageEvent } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/room/variables/UserWithVariablesMessageEvent';
import { RoomObjectVariable } from '@nitrots/nitro-renderer';
import { useCallback, useEffect, useRef, useState } from 'react';
import { GetRoomEngine } from '../../../../api';
import { WiredSelectionVisualizer } from '../../../../api/wired/WiredSelectionVisualizer';
import { useMessageEvent } from '../../../events';
import { useRoom } from '../../useRoom';

interface IVariableHighlight {
    variableName: string;
    furniAssignments: IFurniVariableAssignmentData[];
    userAssignments: IUserVariableAssignmentData[];
}

const getAssignmentObjectId = (assignment: IFurniVariableAssignmentData) =>
    ((assignment.virtualId !== undefined && assignment.virtualId !== null) ? assignment.virtualId : assignment.furniId);

// Global state for clearing display data
let clearFurniDisplayDataCallback: (() => void) | null = null;
let clearUserDisplayDataCallback: (() => void) | null = null;
let globalClearHighlights: (() => void) | null = null;

export const setClearFurniDisplayDataCallback = (callback: () => void) => {
    clearFurniDisplayDataCallback = callback;
};

export const setClearUserDisplayDataCallback = (callback: () => void) => {
    clearUserDisplayDataCallback = callback;
};

// Global function to clear highlights from anywhere (e.g., backend commands)
export const clearHighlightsGlobally = () => {
    if (globalClearHighlights) {
        globalClearHighlights();
    }
};

const useVariableHighlightState = () => {
    const [activeHighlight, setActiveHighlight] = useState<IVariableHighlight | null>(null);
    const { roomSession = null } = useRoom();
    const highlightedUsersRef = useRef<Set<number>>(new Set());

    const setUserHighlightState = useCallback((roomIndex: number, enabled: boolean) =>
    {
        if(!roomSession) return;

        const roomId = roomSession.roomId;

        if((roomId === undefined) || (roomId === null) || (roomIndex === undefined) || (roomIndex === null) || (roomIndex < 0)) return;

        const roomEngine = GetRoomEngine();

        if(!roomEngine) return;

        const flag = enabled ? 1 : 0;

        roomEngine.updateRoomObjectUserAction(roomId, roomIndex, RoomObjectVariable.FIGURE_HIGHLIGHT_ENABLE, flag);
        roomEngine.updateRoomObjectUserAction(roomId, roomIndex, RoomObjectVariable.FIGURE_HIGHLIGHT, flag);
    }, [roomSession]);

    const syncUserHighlights = useCallback((roomIndexes: number[]) =>
    {
        const next = new Set(roomIndexes);
        const current = highlightedUsersRef.current;

        next.forEach(index =>
        {
            if(!current.has(index)) setUserHighlightState(index, true);
        });

        current.forEach(index =>
        {
            if(!next.has(index)) setUserHighlightState(index, false);
        });

        highlightedUsersRef.current = next;
    }, [setUserHighlightState]);

    const clearUserHighlights = useCallback(() =>
    {
        highlightedUsersRef.current.forEach(index => setUserHighlightState(index, false));
        highlightedUsersRef.current = new Set();
    }, [setUserHighlightState]);

    useEffect(() =>
    {
        return () => clearUserHighlights();
    }, [roomSession?.roomId, clearUserHighlights]);

    // Listen for furni variable highlight responses
    useMessageEvent<FurniWithVariablesMessageEvent>(FurniWithVariablesMessageEvent, event => {
        const parser = event.getParser();
        
        // Clear previous furni highlights
        if (activeHighlight) {
            activeHighlight.furniAssignments.forEach(assignment => {
                const objectId = getAssignmentObjectId(assignment);
                if(objectId !== undefined && objectId !== null) WiredSelectionVisualizer.hide(objectId);
            });
        }

        // Update or set highlights - don't clear if this is just an update
        if (parser.assignments.length === 0) {
            // Don't clear if we're already highlighting this same variable (it might be an update in progress)
            // Only clear if this is a different variable or there was no highlight before
            if (!activeHighlight || activeHighlight.variableName !== parser.variableName) {
                setActiveHighlight(null);
            }
            // If we're already highlighting this variable, keep the highlight active but update with empty furni list
            else if (activeHighlight && activeHighlight.variableName === parser.variableName) {
                const updatedHighlight: IVariableHighlight = {
                    variableName: parser.variableName,
                    furniAssignments: [], // Clear furni assignments but keep user assignments
                    userAssignments: activeHighlight.userAssignments
                };
                setActiveHighlight(updatedHighlight);
            }
        } else {
            const newHighlight: IVariableHighlight = {
                variableName: parser.variableName,
                furniAssignments: parser.assignments,
                userAssignments: activeHighlight && activeHighlight.variableName === parser.variableName ? activeHighlight.userAssignments : []
            };

            // Apply visual highlights
            newHighlight.furniAssignments.forEach(assignment => {
                const objectId = getAssignmentObjectId(assignment);
                if(objectId !== undefined && objectId !== null) WiredSelectionVisualizer.show(objectId);
            });

            setActiveHighlight(newHighlight);
        }
    });

    // Listen for user variable highlight responses
    useMessageEvent<UserWithVariablesMessageEvent>(UserWithVariablesMessageEvent, event => {
        const parser = event.getParser();
        
        // Only clear previous highlights if they were furni highlights
        if (activeHighlight && activeHighlight.furniAssignments.length > 0) {
            activeHighlight.furniAssignments.forEach(assignment => {
                const objectId = getAssignmentObjectId(assignment);
                if(objectId !== undefined && objectId !== null) WiredSelectionVisualizer.hide(objectId);
            });
        }

        // Update or set highlights - don't clear if this is just an update
        if (parser.assignments.length === 0) {
            // Don't clear if we're already highlighting this same variable (it might be an update in progress)
            // Only clear if this is a different variable or there was no highlight before
            if (!activeHighlight || activeHighlight.variableName !== parser.variableName) {
                setActiveHighlight(null);
                clearUserHighlights();
            }
            // If we're already highlighting this variable, keep the highlight active but update with empty user list
            else if (activeHighlight && activeHighlight.variableName === parser.variableName) {
                const updatedHighlight: IVariableHighlight = {
                    variableName: parser.variableName,
                    furniAssignments: activeHighlight.furniAssignments,
                    userAssignments: [] // Clear user assignments but keep furni assignments
                };
                setActiveHighlight(updatedHighlight);
            }
        } else {
            const newHighlight: IVariableHighlight = {
                variableName: parser.variableName,
                furniAssignments: activeHighlight && activeHighlight.variableName === parser.variableName ? activeHighlight.furniAssignments : [],
                userAssignments: parser.assignments
            };

            // For users, we don't use WiredSelectionVisualizer, as they need different handling
            syncUserHighlights(parser.assignments.map(assignment => assignment.roomIndex));
            setActiveHighlight(newHighlight);
        }
    });

    const clearHighlights = () => {
        if (activeHighlight) {
            activeHighlight.furniAssignments.forEach(assignment => {
                const objectId = getAssignmentObjectId(assignment);
                if(objectId !== undefined && objectId !== null) WiredSelectionVisualizer.hide(objectId);
            });
            setActiveHighlight(null);
        }
        
        clearUserHighlights();

        // Also clear display data
        if (clearFurniDisplayDataCallback) {
            clearFurniDisplayDataCallback();
        }
        if (clearUserDisplayDataCallback) {
            clearUserDisplayDataCallback();
        }
    };

    // Register the global clear function
    globalClearHighlights = clearHighlights;

    return { activeHighlight, clearHighlights };
};

export const useVariableHighlight = useVariableHighlightState;
