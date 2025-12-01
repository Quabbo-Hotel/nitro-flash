import { IFurniVariableAssignmentData } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/parser/room/variables/FurniWithVariablesMessageParser';
import { IUserVariableAssignmentData } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/parser/room/variables/UserWithVariablesMessageParser';
import { FurniWithVariablesMessageEvent } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/room/variables/FurniWithVariablesMessageEvent';
import { UserWithVariablesMessageEvent } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/room/variables/UserWithVariablesMessageEvent';
import { useState } from 'react';
import { WiredSelectionVisualizer } from '../../../../api/wired/WiredSelectionVisualizer';
import { useMessageEvent } from '../../../events';

interface IVariableHighlight {
    variableName: string;
    furniAssignments: IFurniVariableAssignmentData[];
    userAssignments: IUserVariableAssignmentData[];
}

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

    // Listen for furni variable highlight responses
    useMessageEvent<FurniWithVariablesMessageEvent>(FurniWithVariablesMessageEvent, event => {
        const parser = event.getParser();
        
        // Clear previous furni highlights
        if (activeHighlight) {
            activeHighlight.furniAssignments.forEach(assignment => {
                WiredSelectionVisualizer.hide(assignment.furniId);
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
                WiredSelectionVisualizer.show(assignment.furniId);
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
                WiredSelectionVisualizer.hide(assignment.furniId);
            });
        }

        // Update or set highlights - don't clear if this is just an update
        if (parser.assignments.length === 0) {
            // Don't clear if we're already highlighting this same variable (it might be an update in progress)
            // Only clear if this is a different variable or there was no highlight before
            if (!activeHighlight || activeHighlight.variableName !== parser.variableName) {
                setActiveHighlight(null);
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
            setActiveHighlight(newHighlight);
        }
    });

    const clearHighlights = () => {
        if (activeHighlight) {
            activeHighlight.furniAssignments.forEach(assignment => {
                WiredSelectionVisualizer.hide(assignment.furniId);
            });
            setActiveHighlight(null);
        }
        
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
