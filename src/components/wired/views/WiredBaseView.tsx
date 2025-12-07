
import { WiredClipboardStatusKind } from '@nitrots/nitro-renderer';
import { FC, PropsWithChildren, useEffect, useRef, useState } from 'react';
import { GetSessionDataManager, LocalizeText, WiredFurniType, WiredSelectionVisualizer } from '../../../api';
import { Column, Flex, Grid, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../common';
import { useWired } from '../../../hooks';
import { WiredFurniSelectorView } from './WiredFurniSelectorView';
import { Button } from 'react-bootstrap';

const wiredClipboardKindByType: Record<string, WiredClipboardStatusKind> = {
    trigger: WiredClipboardStatusKind.TRIGGER,
    condition: WiredClipboardStatusKind.CONDITION,
    action: WiredClipboardStatusKind.ACTION,
    selector: WiredClipboardStatusKind.SELECTOR,
    addon: WiredClipboardStatusKind.ADDON
};

export interface WiredBaseViewProps {
    wiredType: string;
    requiresFurni: number;
    hasSpecialInput: boolean;
    allowFurniSelectionIfNone?: boolean;
    save: () => void;
    validate?: () => boolean;
}

export const WiredBaseView: FC<PropsWithChildren<WiredBaseViewProps>> = props => {
    const { wiredType = '', requiresFurni = WiredFurniType.STUFF_SELECTION_OPTION_NONE, save = null, validate = null, children = null, hasSpecialInput = false, allowFurniSelectionIfNone = false } = props;
    const [wiredName, setWiredName] = useState<string>(null);
    const [wiredDescription, setWiredDescription] = useState<string>(null);
    const [needsSave, setNeedsSave] = useState<boolean>(false);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { trigger = null, setTrigger = null, setIntParams = null, setStringParam = null, setFurniIds = null, setDestFurniIds = null, setAllowsFurni = null, saveWired = null, setPreferredSelectionColor = null, setAllowYellowSelection = null, clipboardEntry = null, autoPasteEnabled = false, copyWiredClipboard = null, pasteWiredClipboard = null, setClipboardAutoPaste = null, clearFurniSelection = null, reloadCurrentWired = null, furniIds = [], destFurniIds = [] } = useWired();

    const clipboardTargetKind = wiredClipboardKindByType[wiredType] ?? null;
    const isPasteCompatible = !!clipboardEntry && (!clipboardTargetKind || (clipboardEntry.kind === clipboardTargetKind));
    const hasSelection = (furniIds.length > 0) || (destFurniIds.length > 0);

    const handleCopyClipboard = () => {
        if (!copyWiredClipboard) return;

        copyWiredClipboard();
        setMenuOpen(false);
    };

    const handlePasteClipboard = () => {
        if (!pasteWiredClipboard || !isPasteCompatible) return;

        pasteWiredClipboard();
        setMenuOpen(false);
    };

    const handleAutoPasteToggle = () => {
        if (!setClipboardAutoPaste) return;

        setClipboardAutoPaste(!autoPasteEnabled);
    };

    const handleClearSelection = () => {
        if (!clearFurniSelection) return;

        clearFurniSelection();
        setMenuOpen(false);
    };

    const handleResetConfiguration = () => {
        if (!reloadCurrentWired) return;

        reloadCurrentWired();
        setMenuOpen(false);
    };

    const onClose = () => {
        if (setTrigger) setTrigger(null);

        if (trigger) WiredSelectionVisualizer.hideSelectedWired(trigger.id);
    };

    const onSave = () => {
        if (validate && !validate()) return;

        if (save) save();

        setNeedsSave(true);
        WiredSelectionVisualizer.hideSelectedWired(trigger.id);
    };

    useEffect(() => {
        if (!needsSave) return;

        saveWired();
        WiredSelectionVisualizer.hideSelectedWired(trigger.id);

        setNeedsSave(false);
    }, [needsSave, saveWired, trigger]);

    useEffect(() => {
        if (!menuOpen) return;

        const handleClick = (event: globalThis.MouseEvent) => {
            const target = event.target as Node;

            if (!menuRef.current || menuRef.current.contains(target)) return;

            setMenuOpen(false);
        };

        window.addEventListener('mousedown', handleClick);

        return () => window.removeEventListener('mousedown', handleClick);
    }, [menuOpen]);

    useEffect(() => {
        WiredSelectionVisualizer.showSelectedWired(trigger.id);
        if (!trigger) return;

        const spriteId = (trigger.spriteId || -1);
        const furniData = GetSessionDataManager().getFloorItemData(spriteId);

        if (!furniData) {
            setWiredName(('NAME: ' + spriteId));
            setWiredDescription(('NAME: ' + spriteId));
        }
        else {
            setWiredName(furniData.name);
            setWiredDescription(furniData.description);
        }

        if (setPreferredSelectionColor) setPreferredSelectionColor(0);
        if (setAllowYellowSelection) setAllowYellowSelection(false);

        if (hasSpecialInput) {
            setIntParams(trigger.intData);
            setStringParam(trigger.stringData);
        }

        const shouldAllowFurni = (requiresFurni > WiredFurniType.STUFF_SELECTION_OPTION_NONE) || (allowFurniSelectionIfNone && requiresFurni === WiredFurniType.STUFF_SELECTION_OPTION_NONE);

        if (shouldAllowFurni) {
            setFurniIds(prevValue => {
                if (prevValue && prevValue.length) WiredSelectionVisualizer.clearSelectionShaderFromFurni(prevValue);
                if (trigger.selectedItems && trigger.selectedItems.length) {
                    WiredSelectionVisualizer.applySelectionShaderToFurni(trigger.selectedItems);

                    setDestFurniIds(prevDest => {
                        if (prevDest && prevDest.length) WiredSelectionVisualizer.clearSelectionShaderFromFurniBlue(prevDest);

                        if ((trigger as any).destinationSelectedItems && (trigger as any).destinationSelectedItems.length) {
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

        if (shouldAllowFurni && requiresFurni === WiredFurniType.STUFF_SELECTION_OPTION_NONE) {
            setAllowsFurni(WiredFurniType.STUFF_SELECTION_OPTION_BY_ID_BY_TYPE_OR_FROM_CONTEXT);
        }
        else {
            if (setPreferredSelectionColor && !shouldAllowFurni) setPreferredSelectionColor(0);
            if (setAllowYellowSelection && !shouldAllowFurni) setAllowYellowSelection(false);

            if (shouldAllowFurni && requiresFurni === WiredFurniType.STUFF_SELECTION_OPTION_NONE) {
                setAllowsFurni(WiredFurniType.STUFF_SELECTION_OPTION_BY_ID_BY_TYPE_OR_FROM_CONTEXT);
            }
            else {
                setAllowsFurni(requiresFurni);
            }
        }
    }, [trigger, hasSpecialInput, requiresFurni, setIntParams, setStringParam, setFurniIds, setAllowsFurni, setPreferredSelectionColor, setAllowYellowSelection, setDestFurniIds, allowFurniSelectionIfNone]);

    return (
        <NitroCardView uniqueKey="nitro-wired" className="nitro-wired" theme="wired">
            <NitroCardHeaderView style={{ backgroundColor: "transparent" }} isWired={true} headerText={LocalizeText('wiredfurni.title')} onCloseClick={onClose}>
                <Flex className="wired-menu" ref={menuRef}>
                    <Flex className='container-btn-wired-menu '>
                        <button type="button" className="btn-wired-menu" onClick={() => setMenuOpen(value => !value)} />
                    </Flex>
                    {menuOpen &&
                        <div className="wired-menu-dropdown">
                            <div className=' grid-menu-wired grid-menu-wired-top'  onClick={handleCopyClipboard}>
                                <div></div>
                                <button type="button" className="wired-menu-item " disabled={!trigger} >
                                    Copiar configuración
                                </button>
                            </div>

                            <div className='grid-menu-wired grid-menu-wired-center' onClick={handlePasteClipboard}>
                                <div></div>
                                <button type="button" className="wired-menu-item" disabled={(!clipboardEntry || !isPasteCompatible)} >
                                    Pegar configuración
                                </button>
                            </div>

                            <label className="grid-menu-wired wired-menu-item grid-menu-wired-center" onChange={handleAutoPasteToggle}>
                                <Flex style={{width:"20px", height:"14px"}} center>
                                    <input className="check-menu-wired" type="checkbox" checked={autoPasteEnabled}  />
                                </Flex>
                                <span style={{textIndent:"5px"}}>Copiar en otro Wired</span>
                            </label>

                            <Flex center gap={1}>
                                <div className="wired-menu-separator" />
                            </Flex>
                            <div className='grid-menu-wired grid-menu-wired-center' onClick={handleClearSelection}>
                                <div></div>
                                <button type="button" className="wired-menu-item" disabled={!hasSelection} >
                                    Limpiar selección de furnis
                                </button>
                            </div>
                            <div className='grid-menu-wired grid-menu-wired-bottom' onClick={handleResetConfiguration}>
                                <div></div>
                                <button type="button" className="wired-menu-item" >
                                    Restablecer la configuración
                                </button>
                            </div>
                        </div>}
                </Flex>
            </NitroCardHeaderView>
            <NitroCardContentView>
                <Column gap={1}>
                    <Flex alignItems="center" gap={1}>
                        <i className={`icon icon-wired-${wiredType}`} />
                        <Text gfbold>{wiredName}</Text>
                    </Flex>
                    <Text>{wiredDescription}</Text>
                </Column>
                {!!children && <hr className="m-0 bg-dark" />}
                {children}
                {(requiresFurni > WiredFurniType.STUFF_SELECTION_OPTION_NONE) &&
                    <>
                        <hr className="m-0 bg-dark" />
                        <WiredFurniSelectorView />
                    </>}
                <Flex alignItems="center" gap={1}>
                    <button type="button" className="btn btn-primary notification-buttons w-100" onClick={onSave}>{LocalizeText('wiredfurni.ready')}</button>
                    <button type="button" className="btn btn-primary notification-buttons w-100" onClick={onClose}>{LocalizeText('cancel')}</button>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
};
