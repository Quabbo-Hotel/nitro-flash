import { WiredActionDefinition } from '@nitrots/nitro-renderer';
import { FC, PropsWithChildren, useEffect } from 'react';
import { GetWiredTimeLocale, LocalizeText, WiredFurniType } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredBaseView } from '../WiredBaseView';
import { WiredSliderArrows } from '../WiredSliderArrows';

export interface WiredActionBaseViewProps {
    hasSpecialInput: boolean;
    requiresFurni: number;
    save: () => void;
    allowFurniSelectionIfNone?: boolean;
}

export const WiredActionBaseView: FC<PropsWithChildren<WiredActionBaseViewProps>> = props => {
    const { requiresFurni = WiredFurniType.STUFF_SELECTION_OPTION_NONE, save = null, hasSpecialInput = false, allowFurniSelectionIfNone = false, children = null } = props;
    const { trigger = null,
        actionDelay = 0,
        setActionDelay = null,
        furniOptions = 0,
        setFurniOptions = null,
        furniType = 0,
        setFurniType = null,
        userOptions = 0,
        setUserOptions = null,
        userType = 0,
        setUserType = null
    } = useWired();

    useEffect(() => {
        setActionDelay((trigger as WiredActionDefinition).delayInPulses);
        setFurniOptions((trigger as WiredActionDefinition).furniOptions)
        setFurniType((trigger as WiredActionDefinition).furniType)
        setUserOptions((trigger as WiredActionDefinition).userOptions)
        setUserType((trigger as WiredActionDefinition).userType)

    }, [trigger,
        setActionDelay,
        setFurniOptions,
        setFurniType,
        setUserOptions,
        setUserType
    ]);

    return (
        <WiredBaseView wiredType="action" requiresFurni={requiresFurni} allowFurniSelectionIfNone={allowFurniSelectionIfNone} save={save} hasSpecialInput={hasSpecialInput}>
            {children}
            {!!children && <hr className="m-0 bg-dark" />}
            <Column>
                <Text className='goldfish-bold'>{LocalizeText('wiredfurni.params.delay', ['seconds'], [GetWiredTimeLocale(actionDelay)])}</Text>
                <WiredSliderArrows
                    min={ 0 }
                    max={ 20 }
                    value={ actionDelay }
                    onChange={ value => setActionDelay(value) } />
            </Column>

            {furniOptions === 1 && (
                <Column>
                    <Text center bold>{LocalizeText('select.furni.source.actions', ['seconds'], [GetWiredTimeLocale(actionDelay)])}</Text>
                    <div className='align-advancedoptionsone'>
                        <div className="button-group">
                            <Flex center className={` placeholder-adv-options ${furniType === 0 ? 'placeholder-adv-options-selected ' : 'placeholder-adv-options'}`}>
                                <div
                                    onClick={() => setFurniType(0)}
                                    className={` icon-neighbor-1 button-icons-selector-general`} />
                            </Flex>
                            <Flex center className={` placeholder-adv-options ${furniType === 1 ? 'placeholder-adv-options-selected ' : 'placeholder-adv-options'}`}>
                                <div
                                    onClick={() => setFurniType(1)}
                                    className={` icon-neighbor-5 button-icons-selector-general`}
                                />
                            </Flex>
                            <Flex center className={` placeholder-adv-options ${furniType === 2 ? 'placeholder-adv-options-selected ' : 'placeholder-adv-options'}`}>
                                <div
                                    onClick={() => setFurniType(2)}
                                    className={` icon-neighbor-3 button-icons-selector-general`}
                                />
                            </Flex>
                            <Flex center className={` placeholder-adv-options ${furniType === 3 ? 'placeholder-adv-options-selected' : 'placeholder-adv-options'}`}>
                                <div
                                    onClick={() => setFurniType(3)}
                                    className={` icon-neighbor-2 button-icons-selector-general`} />
                            </Flex>


                        </div>
                    </div>
                    {furniType !== undefined && (
                        <Text style={{ textAlign: "center" }}>{['Seleccionados', 'Selector', 'Usar Item Desencadenante', 'Items de Señal'][furniType]}</Text>
                    )}

                </Column>
            )}


            {userOptions === 1 && (
                <Column>
                    <Text bold>Users</Text>
                    <div className='align-advancedoptionsone'>
                        <div className="button-group">
                            <button
                                onClick={() => setUserType(0)}
                                className={` icon-neighbor-0 ${userType === 0 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`}
                            /><button
                                onClick={() => setUserType(1)}
                                className={` icon-neighbor-5 ${userType === 1 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`}
                            /><button
                                onClick={() => setUserType(2)}
                                className={` icon-neighbor-2 ${userType === 2 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`}
                            />
                        </div>
                    </div>
                    {userType !== undefined && (
                        <Text style={{ textAlign: "center" }}>{['Usuario Accionador', 'Usuario de Selector', 'Usuario de Señal', 'Usar Items de Señal'][userType]}</Text>
                    )}
                </Column>

            )}
        </WiredBaseView>
    );
}
