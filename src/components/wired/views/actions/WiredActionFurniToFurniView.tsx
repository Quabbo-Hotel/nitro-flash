import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType, WiredSelectionVisualizer } from '../../../../api';
import { Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionFurniToFurniView: FC<{}> = props =>
{
    const [destType, setDestType] = useState(0);
    const [isSelectingSource, setIsSelectingSource] = useState(false);
    const [isSelectingDest, setIsSelectingDest] = useState(false);
    const { trigger = null, setIntParams = null, furniType = 0, setFurniType = null, furniIds = [], setFurniIds = null, destFurniIds = [], setDestFurniIds = null, selectMode = 0, setSelectMode = null, setAllowsFurni = null, setFurniOptions = null, setPreferredSelectionColor = null, setAllowYellowSelection = null } = useWired();

    const save = () => setIntParams([destType])

    useEffect(() =>
    {
        if (trigger)
        {
            if ((trigger as any).selectedItems && (trigger as any).selectedItems.length) {
                setFurniIds((trigger as any).selectedItems);
                WiredSelectionVisualizer.applySelectionShaderToFurniYellow((trigger as any).selectedItems);
            }

            if ((trigger as any).destinationSelectedItems && (trigger as any).destinationSelectedItems.length) {
                // init dest selected ids
                setDestFurniIds((trigger as any).destinationSelectedItems);
                WiredSelectionVisualizer.applySelectionShaderToFurniBlue((trigger as any).destinationSelectedItems);
            }

            setDestType(trigger.intData && trigger.intData.length > 0 ? trigger.intData[0] : 0);

            // Make this wired use yellow as the default selection color
            if (setPreferredSelectionColor) setPreferredSelectionColor(1);
            if (setAllowYellowSelection) setAllowYellowSelection(true);

            // force the base action not to show default advanced furni options
            if (setFurniOptions) setFurniOptions(0);
        }
        else
        {
            if (setPreferredSelectionColor) setPreferredSelectionColor(0);
            if (setAllowYellowSelection) setAllowYellowSelection(false);
        }
    }, [trigger]);


    return <WiredActionBaseView allowFurniSelectionIfNone={true} requiresFurni={WiredFurniType.STUFF_SELECTION_OPTION_NONE} hasSpecialInput={false} save={save} >
        <hr className="m-0 bg-dark" />
        <Text bold>{LocalizeText('wiredfurni.params.select.furni.font')}</Text>
        <div className='align-advancedoptionsone'>

            <div className="button-group">
                {/* Source (yellow) types */}
                <button
                    onClick={() => setFurniType(0)}
                    className={` icon-neighbor-1 ${furniType === 0 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`}
                />
                <button
                    onClick={() => setFurniType(1)}
                    className={` icon-neighbor-5 ${furniType === 1 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`}
                />
                <button
                    onClick={() => setFurniType(2)}
                    className={` icon-neighbor-3 ${furniType === 2 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`}
                />
                <button
                    onClick={() => setFurniType(3)}
                    className={` icon-neighbor-2 ${furniType === 3 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`}
                />



            </div>
            {/* Show yellow selection button when sourceType is selected */}
            {furniType === 0 && (
                <div className="button-group mt-2">
                    <button
                        onClick={() => {
                            if (isSelectingSource) {
                                setIsSelectingSource(false);
                                setSelectMode(0);
                                setAllowsFurni(WiredFurniType.STUFF_SELECTION_OPTION_NONE);
                                WiredSelectionVisualizer.clearSelectionShaderFromFurniYellow(furniIds);
                            } else {
                                // deactivate destination selection
                                setIsSelectingDest(false);
                                setSelectMode(1);
                                setIsSelectingSource(true);
                                setAllowsFurni(WiredFurniType.STUFF_SELECTION_OPTION_BY_ID_BY_TYPE_OR_FROM_CONTEXT);
                                WiredSelectionVisualizer.applySelectionShaderToFurniYellow(furniIds);
                                WiredSelectionVisualizer.clearSelectionShaderFromFurniBlue(destFurniIds);
                            }
                        }}
                        className={` ${isSelectingSource ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`}
                        style={{ backgroundColor: isSelectingSource ? 'rgba(255,235,170,0.9)' : undefined }}
                    >
                        <i className='icon icon-holy-plus' />
                    </button>
                </div>
            )}
        </div>
        {/* Destination types (blue) */}
        <hr className="m-0 bg-dark" />
        <div className='align-advancedoptionsone'>
            <div className="button-group">
                <button
                    onClick={() => setDestType(0)}
                    className={` icon-neighbor-1 ${destType === 0 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`}
                />
                <button
                    onClick={() => setDestType(1)}
                    className={` icon-neighbor-5 ${destType === 1 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`}
                />
                <button
                    onClick={() => setDestType(2)}
                    className={` icon-neighbor-3 ${destType === 2 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`}
                />
                <button
                    onClick={() => setDestType(3)}
                    className={` icon-neighbor-2 ${destType === 3 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`}
                />
            </div>
            {destType === 0 && (
                <div className="button-group mt-2">
                    <button
                        onClick={() => {
                            if (isSelectingDest) {
                                setIsSelectingDest(false);
                                setSelectMode(0);
                                setAllowsFurni(WiredFurniType.STUFF_SELECTION_OPTION_NONE);
                                WiredSelectionVisualizer.clearSelectionShaderFromFurniBlue(destFurniIds);
                            } else {
                                // deactivate source selection
                                setIsSelectingSource(false);
                                setSelectMode(2);
                                setIsSelectingDest(true);
                                setAllowsFurni(WiredFurniType.STUFF_SELECTION_OPTION_BY_ID_BY_TYPE_OR_FROM_CONTEXT);
                                WiredSelectionVisualizer.applySelectionShaderToFurniBlue(destFurniIds);
                                WiredSelectionVisualizer.clearSelectionShaderFromFurniYellow(furniIds);
                            }
                        }}
                        className={` ${isSelectingDest ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`}
                        style={{ backgroundColor: isSelectingDest ? 'rgba(170,205,255,0.9)' : undefined }}
                    >
                        <i className='icon icon-holy-plus' />
                    </button>
                </div>
            )}
        <Text style={{ textAlign: 'center' }}>{['Fuente: Seleccionados', 'Fuente: Selector','Fuente: Item de activación', 'Fuente: Señal'][furniType]}</Text>
        </div>
        <Text style={{ textAlign: "center" }}>{['Seleccionados', 'Selector','Item de activación', 'Señal'][destType]}</Text>

    </WiredActionBaseView>;
};
