import { ConditionDefinition } from '@nitrots/nitro-renderer';
import { FC, PropsWithChildren, useEffect } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredBaseView } from '../WiredBaseView';

export interface WiredConditionBaseViewProps
{
    hasSpecialInput: boolean;
    requiresFurni: number;
    save: () => void;
    allOrOne?: boolean;
    allOrOneFor?: number;
    customAllOrOneTexts?: string[];
}

export const WiredConditionBaseView: FC<PropsWithChildren<WiredConditionBaseViewProps>> = (props) =>
{
    const {
        requiresFurni = WiredFurniType.STUFF_SELECTION_OPTION_NONE,
        save = null,
        hasSpecialInput = false,
        children = null,
        allOrOne = false,
        allOrOneFor, // ✅ aquí solo lo recoges, sin tipo
        customAllOrOneTexts = null
    } = props;

    const { trigger = null,
        furniOptions = 0,
        setFurniOptions = null,
        furniType = 0,
        setFurniType = null,
        userOptions = 0,
        setUserOptions = null,
        userType = 0,
        setUserType = null,
        allOrOneOptions = 0,
        setAllOrOneOptions = null,
        allOrOneType = 0,
        setAllOrOneType = null,
    } = useWired();

    useEffect(() =>
    {
        setFurniOptions((trigger as ConditionDefinition)?.furniOptions);
        setFurniType((trigger as ConditionDefinition)?.furniType);
        setUserOptions((trigger as ConditionDefinition)?.userOptions);
        setUserType((trigger as ConditionDefinition)?.userType);
        setAllOrOneOptions((trigger as ConditionDefinition)?.allOrOneOptions);
        setAllOrOneType((trigger as ConditionDefinition)?.allOrOneType);
    }, [
        trigger,
        setFurniOptions,
        setFurniType,
        setUserOptions,
        setUserType,
        setAllOrOneOptions,
        setAllOrOneType
    ]);

    const onSave = () => (save && save());

    return (
        <WiredBaseView wiredType="condition" requiresFurni={requiresFurni} hasSpecialInput={hasSpecialInput} save={onSave}>
            {children}

            {(allOrOne || allOrOneOptions === 1) && (
                <Column gap={1}>
                    <Text bold>{LocalizeText('wired_select_mode_u_want')}</Text>
                    {[0, 1].map(mode =>
                        <Flex key={mode} gap={1}>
                            <input
                                type="radio"
                                name="wiredToggle"
                                checked={(allOrOneType === mode)}
                                onChange={() => setAllOrOneType(mode)}
                            />
                            <Text>
                                {customAllOrOneTexts ? customAllOrOneTexts[mode] : LocalizeText(
                                    (() =>
                                    {
                                        const mapping = {
                                            0: 'wired.params.allorone.players.',
                                            1: 'wired.params.allorone.furnis.',
                                            2: 'wired.params.allorone.condition.type.',
                                            // agrega más casos si los necesitas
                                        };
                                        return mapping[props.allOrOneFor] || 'wired.params.allorone.players.';
                                    })() + mode
                                )}
                            </Text>

                        </Flex>
                    )}
                </Column>
            )}


            {furniOptions === 1 && (
                <Column>
                    <Text bold>Furni</Text>
                    <div className='align-advancedoptionsone'>
                        <div className="button-group">
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
