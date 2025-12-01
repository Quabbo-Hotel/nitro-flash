import { ConditionDefinition, OpenMessageComposer, Triggerable, TriggerDefinition, UpdateActionMessageComposer, UpdateAddonMessageComposer, UpdateConditionMessageComposer, UpdateSelectorMessageComposer, UpdateTriggerMessageComposer, WiredActionDefinition, WiredAddonDefinition, WiredFurniActionEvent, WiredFurniAddonEvent, WiredFurniConditionEvent, WiredFurniSelectorEvent, WiredFurniTriggerEvent, WiredOpenEvent, WiredSaveSuccessEvent, WiredSelectorDefinition } from '@nitrots/nitro-renderer';
import { useEffect, useState } from 'react';
import { useBetween } from 'use-between';
import { IsOwnerOfFloorFurniture, LocalizeText, SendMessageComposer, WiredFurniType, WiredSelectionVisualizer } from '../../api';
import { useMessageEvent } from '../events';
import { useNotification } from '../notification';

const useWiredState = () =>
{
    const [trigger, setTrigger] = useState<Triggerable>(null);
    const [intParams, setIntParams] = useState<number[]>([]);
    const [stringParam, setStringParam] = useState<string>('');
    const [furniIds, setFurniIds] = useState<number[]>([]);
    const [destFurniIds, setDestFurniIds] = useState<number[]>([]);
    const [actionDelay, setActionDelay] = useState<number>(0);
    //Selector
    const [isFiltered, setIsFiltered] = useState<number>(0);
    const [isInverted, setIsInverted] = useState<number>(0);
    //Action
    const [furniOptions, setFurniOptions] = useState<number>(0);
    const [furniType, setFurniType] = useState<number>(0);
    const [userOptions, setUserOptions] = useState<number>(0);
    const [userType, setUserType] = useState<number>(0);
    const [allOrOneOptions, setAllOrOneOptions] = useState<number>(0);
    const [allOrOneType, setAllOrOneType] = useState<number>(0);
    const [allowsFurni, setAllowsFurni] = useState<number>(WiredFurniType.STUFF_SELECTION_OPTION_NONE);
    const [selectMode, setSelectMode] = useState<number>(0); // 0 none, 1 source (yellow), 2 dest (blue)
    const [preferredSelectionColor, setPreferredSelectionColor] = useState<number>(0); // 0 = default gray, 1 = yellow (furnitofurni only)
    const [allowYellowSelection, setAllowYellowSelection] = useState<boolean>(false);
    const { showConfirm = null } = useNotification();

    const saveWired = () =>
    {
        const save = (trigger: Triggerable) =>
        {
            if (!trigger) return;

            if (trigger instanceof WiredActionDefinition)
            {
                SendMessageComposer(new UpdateActionMessageComposer(trigger.id, intParams, stringParam, furniIds, actionDelay, furniOptions, furniType, userOptions, userType, trigger.stuffTypeSelectionCode, destFurniIds));
            }

            else if (trigger instanceof TriggerDefinition)
            {
                SendMessageComposer(new UpdateTriggerMessageComposer(trigger.id, intParams, stringParam, furniIds, trigger.stuffTypeSelectionCode));
            }

            else if (trigger instanceof ConditionDefinition)
            {
                SendMessageComposer(new UpdateConditionMessageComposer(trigger.id, intParams, stringParam, furniIds, furniOptions, furniType, userOptions, userType, allOrOneOptions, allOrOneType));
            }
            else if (trigger instanceof WiredSelectorDefinition)
            {
                SendMessageComposer(new UpdateSelectorMessageComposer(trigger.id, intParams, stringParam, furniIds, isFiltered, isInverted, trigger.stuffTypeSelectionCode,));
            }
            else if (trigger instanceof WiredAddonDefinition)
            {
                SendMessageComposer(new UpdateAddonMessageComposer(trigger.id, intParams, stringParam, furniIds, trigger.stuffTypeSelectionCode));
            }
        };

        if (!IsOwnerOfFloorFurniture(trigger.id))
        {
            showConfirm(LocalizeText('wiredfurni.nonowner.change.confirm.body'), () =>
            {
                save(trigger);
            }, null, null, null, LocalizeText('wiredfurni.nonowner.change.confirm.title'));
        }
        else
        {
            save(trigger);
        }
    };

    const selectObjectForWired = (objectId: number, category: number) =>
    {
        if (!trigger || !allowsFurni) return;
        if (objectId <= 0) return;

        // if selectMode is 0 -> default (source/yellow), 1 -> source (yellow), 2 -> destination (blue)
        if (selectMode === 0 || selectMode === 1)
        {
            setFurniIds(prevValue =>
            {
                const newFurniIds = [...prevValue];

                const index = prevValue.indexOf(objectId);

                if (index >= 0)
                {
                    newFurniIds.splice(index, 1);
                    // Clear whatever shader was applied to this furni
                    WiredSelectionVisualizer.clearSelectionShaderFromFurni([objectId]);
                }

                else if (newFurniIds.length < trigger.maximumItemSelectionCount)
                {
                    newFurniIds.push(objectId);
                    if (preferredSelectionColor === 1 && allowYellowSelection) WiredSelectionVisualizer.applySelectionShaderToFurniYellow([objectId]);
                    else WiredSelectionVisualizer.applySelectionShaderToFurni([objectId]);
                }

                return newFurniIds;
            });

            // Ensure the object is not in destination set at the same time
            setDestFurniIds(prevDest =>
            {
                if (!prevDest || prevDest.length === 0) return prevDest;
                const idx = prevDest.indexOf(objectId);
                if (idx >= 0) {
                    const newDest = [...prevDest];
                    newDest.splice(idx, 1);
                    WiredSelectionVisualizer.clearSelectionShaderFromFurniBlue([objectId]);
                    return newDest;
                }
                return prevDest;
            });
        }
        else if (selectMode === 2)
        {
            setDestFurniIds(prevValue =>
            {
                const newFurniIds = [...prevValue];

                const index = prevValue.indexOf(objectId);

                if (index >= 0)
                {
                    newFurniIds.splice(index, 1);
                    WiredSelectionVisualizer.clearSelectionShaderFromFurniBlue([objectId]);
                }

                else if (newFurniIds.length < trigger.maximumItemSelectionCount)
                {
                    newFurniIds.push(objectId);
                    WiredSelectionVisualizer.applySelectionShaderToFurniBlue([objectId]);
                }

                return newFurniIds;
            });

            // Ensure the object is not in source set at the same time
            setFurniIds(prevSrc =>
            {
                if (!prevSrc || prevSrc.length === 0) return prevSrc;
                const idx = prevSrc.indexOf(objectId);
                if (idx >= 0) {
                    const newSrc = [...prevSrc];
                    newSrc.splice(idx, 1);
                    // Clear either the yellow or gray shader from furni
                    WiredSelectionVisualizer.clearSelectionShaderFromFurni([objectId]);
                    return newSrc;
                }
                return prevSrc;
            });
        }
    };

    useMessageEvent<WiredOpenEvent>(WiredOpenEvent, event =>
    {
        const parser = event.getParser();

        SendMessageComposer(new OpenMessageComposer(parser.stuffId));
    });

    useMessageEvent<WiredSaveSuccessEvent>(WiredSaveSuccessEvent, event =>
    {
        const parser = event.getParser();

        setTrigger(null);
    });
    
    useMessageEvent<WiredFurniSelectorEvent>(WiredFurniSelectorEvent, event =>
    {
        const parser = event.getParser();

        setTrigger(parser.definition);
    });
    
    useMessageEvent<WiredFurniAddonEvent>(WiredFurniAddonEvent, event =>
    {
        const parser = event.getParser();

        setTrigger(parser.definition);
    });

    useMessageEvent<WiredFurniActionEvent>(WiredFurniActionEvent, event =>
    {
        const parser = event.getParser();

        setTrigger(parser.definition);
    });

    useMessageEvent<WiredFurniConditionEvent>(WiredFurniConditionEvent, event =>
    {
        const parser = event.getParser();

        setTrigger(parser.definition);
    });

    useMessageEvent<WiredFurniTriggerEvent>(WiredFurniTriggerEvent, event =>
    {
        const parser = event.getParser();

        setTrigger(parser.definition);
    });

    useEffect(() =>
    {
        if (!trigger) return;
        if (trigger)
        {
            WiredSelectionVisualizer.hideSelectedWired(trigger.id);
        }

        return () =>
        {
            if (trigger)
            {
                WiredSelectionVisualizer.hideSelectedWired(trigger.id);
            }
            setIntParams([]);
            setStringParam('');
            setActionDelay(0);
            setFurniOptions(0);
            setFurniType(0);
            setUserOptions(0);
            setUserType(0);
            setIsFiltered(0);
            setIsInverted(0);
            setFurniIds(prevValue =>
            {
                if (prevValue && prevValue.length) WiredSelectionVisualizer.clearSelectionShaderFromFurni(prevValue);

                return [];
            });
            setDestFurniIds(prevValue =>
            {
                if (prevValue && prevValue.length) WiredSelectionVisualizer.clearSelectionShaderFromFurniBlue(prevValue);

                return [];
            });
            setAllowsFurni(WiredFurniType.STUFF_SELECTION_OPTION_NONE);
            setSelectMode(0);
        };
    }, [trigger]);

    return { trigger, setTrigger, intParams, setIntParams, stringParam, setStringParam, furniIds, setFurniIds, destFurniIds, setDestFurniIds, actionDelay, setActionDelay,isFiltered, setIsFiltered, isInverted, setIsInverted, furniOptions, setFurniOptions, furniType, setFurniType,userOptions,setUserOptions,userType,setUserType, selectMode, setSelectMode, setAllowsFurni, saveWired, selectObjectForWired, allOrOneOptions, setAllOrOneOptions, allOrOneType, setAllOrOneType, preferredSelectionColor, setPreferredSelectionColor, allowYellowSelection, setAllowYellowSelection };
};

export const useWired = () => useBetween(useWiredState);
