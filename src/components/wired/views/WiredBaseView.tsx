
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { GetSessionDataManager, LocalizeText, WiredFurniType, WiredSelectionVisualizer } from '../../../api';
import { Button, Column, Flex, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../common';
import { useWired } from '../../../hooks';
import { WiredFurniSelectorView } from './WiredFurniSelectorView';

export interface WiredBaseViewProps
{
    wiredType: string;
    requiresFurni: number;
    hasSpecialInput: boolean;
    allowFurniSelectionIfNone?: boolean;
    save: () => void;
    validate?: () => boolean;
}

export const WiredBaseView: FC<PropsWithChildren<WiredBaseViewProps>> = props =>
{
    const { wiredType = '', requiresFurni = WiredFurniType.STUFF_SELECTION_OPTION_NONE, save = null, validate = null, children = null, hasSpecialInput = false, allowFurniSelectionIfNone = false } = props;
    const [wiredName, setWiredName] = useState<string>(null);
    const [wiredDescription, setWiredDescription] = useState<string>(null);
    const [needsSave, setNeedsSave] = useState<boolean>(false);
    const { trigger = null, setTrigger = null, setIntParams = null, setStringParam = null, setFurniIds = null, setDestFurniIds = null, setAllowsFurni = null, saveWired = null, setPreferredSelectionColor = null, setAllowYellowSelection = null } = useWired();

    const onClose = () => (setTrigger(null), WiredSelectionVisualizer.hideSelectedWired(trigger.id));

    const onSave = () =>
    {
        if (validate && !validate()) return;

        if (save) save();

        setNeedsSave(true);
        WiredSelectionVisualizer.hideSelectedWired(trigger.id)
    };

    useEffect(() =>
    {
        if (!needsSave) return;

        saveWired();
        WiredSelectionVisualizer.hideSelectedWired(trigger.id)

        setNeedsSave(false);
    }, [needsSave, saveWired]);

    useEffect(() =>
    {
        WiredSelectionVisualizer.showSelectedWired(trigger.id)
        if (!trigger) return;

        const spriteId = (trigger.spriteId || -1);
        const furniData = GetSessionDataManager().getFloorItemData(spriteId);

        if (!furniData)
        {
            setWiredName(('NAME: ' + spriteId));
            setWiredDescription(('NAME: ' + spriteId));
        }
        else
        {
            setWiredName(furniData.name);
            setWiredDescription(furniData.description);
        }

        // reset preference to default gray on wired open and disallow yellow by default
        if (setPreferredSelectionColor) setPreferredSelectionColor(0);
        if (setAllowYellowSelection) setAllowYellowSelection(false);

        if (hasSpecialInput)
        {
            setIntParams(trigger.intData);
            setStringParam(trigger.stringData);
        }

        const shouldAllowFurni = (requiresFurni > WiredFurniType.STUFF_SELECTION_OPTION_NONE) || (allowFurniSelectionIfNone && requiresFurni === WiredFurniType.STUFF_SELECTION_OPTION_NONE);

        if (shouldAllowFurni)
        {
            setFurniIds(prevValue =>
            {
                if (prevValue && prevValue.length) WiredSelectionVisualizer.clearSelectionShaderFromFurni(prevValue);
                if (trigger.selectedItems && trigger.selectedItems.length)
                {
                    WiredSelectionVisualizer.applySelectionShaderToFurni(trigger.selectedItems);

                    // Ensure we clear + highlight any existing destination selected items too
                    setDestFurniIds(prevDest => {
                        if(prevDest && prevDest.length) WiredSelectionVisualizer.clearSelectionShaderFromFurniBlue(prevDest);

                        if((trigger as any).destinationSelectedItems && (trigger as any).destinationSelectedItems.length)
                        {
                            WiredSelectionVisualizer.applySelectionShaderToFurniBlue((trigger as any).destinationSelectedItems);
                            return (trigger as any).destinationSelectedItems;
                        }

                        return [];
                    });

                    return trigger.selectedItems;
                }

                return [];
            });
        }

        if (shouldAllowFurni && requiresFurni === WiredFurniType.STUFF_SELECTION_OPTION_NONE)
        {
            // If the wired designer wants to hide the special furni selector but still allow clicking to select items
            setAllowsFurni(WiredFurniType.STUFF_SELECTION_OPTION_BY_ID_BY_TYPE_OR_FROM_CONTEXT);
        }
        else
        {
            if (setPreferredSelectionColor && !shouldAllowFurni) setPreferredSelectionColor(0);
            if (setAllowYellowSelection && !shouldAllowFurni) setAllowYellowSelection(false);

            if (shouldAllowFurni && requiresFurni === WiredFurniType.STUFF_SELECTION_OPTION_NONE)
            {
                // If the wired designer wants to hide the special furni selector but still allow clicking to select items
                setAllowsFurni(WiredFurniType.STUFF_SELECTION_OPTION_BY_ID_BY_TYPE_OR_FROM_CONTEXT);
            }
            else
            {
                setAllowsFurni(requiresFurni);
            }
        }
    }, [trigger, hasSpecialInput, requiresFurni, setIntParams, setStringParam, setFurniIds, setAllowsFurni]);

    return (
        <NitroCardView uniqueKey="nitro-wired" className="nitro-wired" theme="primary-slim">
            <NitroCardHeaderView headerText={LocalizeText('wiredfurni.title')} onCloseClick={onClose} />
            <NitroCardContentView>
                <Column gap={1}>
                    <Flex alignItems="center" gap={1}>
                        <i className={`icon icon-wired-${wiredType}`} />
                        <Text bold>{wiredName}</Text>
                    </Flex>
                    <Text small>{wiredDescription}</Text>
                </Column>
                {!!children && <hr className="m-0 bg-dark" />}
                {children}
                {(requiresFurni > WiredFurniType.STUFF_SELECTION_OPTION_NONE) &&
                    <>
                        <hr className="m-0 bg-dark" />
                        <WiredFurniSelectorView />
                    </>}
                <Flex alignItems="center" gap={1}>
                    <Button fullWidth variant="success" onClick={onSave}>{LocalizeText('wiredfurni.ready')}</Button>
                    <Button fullWidth variant="secondary" onClick={onClose}>{LocalizeText('cancel')}</Button>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
};
