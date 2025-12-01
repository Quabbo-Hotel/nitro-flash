import { FC, useEffect, useState } from 'react';
import { Column, Flex, Text } from '../../../../common';
import { VariableSelectorComponent } from '../actions/components/VariableSelectorComponent';
import { useWired } from '../../../../hooks';
import { WiredAddonBaseView } from './WiredAddonBaseView';

export const WiredAddonFilterUsersByVarView: FC = () => {
    const { trigger = null, setStringParam = null, setIntParams = null } = useWired();

    const [selectedVar, setSelectedVar] = useState('');
    const [sortType, setSortType] = useState(0);
    const [countMode, setCountMode] = useState(0);
    const [fixedCount, setFixedCount] = useState(1);
    const [countVar, setCountVar] = useState('');
    const [countVarTarget, setCountVarTarget] = useState(2);

    useEffect(() => {
        if(!trigger) return;
        setSelectedVar((trigger.stringData || '').split('::', 2)[0] || '');
        if(trigger.intData.length > 0) setSortType(trigger.intData[0]);
        if(trigger.intData.length > 1) setCountMode(trigger.intData[1]);
        if(trigger.intData.length > 2) setFixedCount(trigger.intData[2]);
        if(trigger.intData.length > 3) setCountVarTarget(trigger.intData[3]);
        setCountVar((trigger.stringData || '').split('::', 2)[1] || '');
    }, [trigger]);

    const save = () => {
        setStringParam(selectedVar + (countMode === 1 ? '::' + countVar : ''));
        setIntParams([sortType, countMode, fixedCount, countVarTarget]);
    };

    return (
        <WiredAddonBaseView hasSpecialInput={true} save={save} requiresFurni={0}>
            <Column gap={1}>
                <VariableSelectorComponent
                    selectedVariable={selectedVar}
                    onVariableChange={setSelectedVar}
                    targetType={1}
                    onTargetTypeChange={() => {}}
                    typeOfAdvancedOption={4}
                    onAdvancedOptionChange={() => {}}
                    label="Variable a filtrar:"
                    showAdvancedOptions={false}
                    placeholder="-- variable --"
                    showGlobal={false}
                />

                <Text bold>Ordenar por</Text>
                <div>
                    <label><input type='radio' checked={sortType === 0} onChange={() => setSortType(0)} /> Mayor valor</label>
                    <label><input type='radio' checked={sortType === 1} onChange={() => setSortType(1)} /> Menor valor</label>
                    <label><input type='radio' checked={sortType === 2} onChange={() => setSortType(2)} /> Fecha creación (antigua)</label>
                    <label><input type='radio' checked={sortType === 3} onChange={() => setSortType(3)} /> Fecha creación (reciente)</label>
                    <label><input type='radio' checked={sortType === 4} onChange={() => setSortType(4)} /> Fecha modificación (antigua)</label>
                    <label><input type='radio' checked={sortType === 5} onChange={() => setSortType(5)} /> Fecha modificación (reciente)</label>
                </div>

                <Text bold>Cantidad a filtrar</Text>
                <Flex gap={1} alignItems='center'>
                    <input type='radio' name='cmu' checked={countMode === 0} onChange={() => setCountMode(0)} />
                    <Text>Definir valor</Text>
                    <input type='number' value={fixedCount} onChange={e => setFixedCount(parseInt(e.target.value) || 0)} />
                </Flex>
                <Flex gap={1} alignItems='center'>
                    <input type='radio' name='cmu' checked={countMode === 1} onChange={() => setCountMode(1)} />
                    <Text>A partir de variable</Text>
                </Flex>
                {countMode === 1 && (
                    <VariableSelectorComponent
                        selectedVariable={countVar}
                        onVariableChange={setCountVar}
                        targetType={countVarTarget}
                        onTargetTypeChange={setCountVarTarget}
                        typeOfAdvancedOption={4}
                        onAdvancedOptionChange={() => {}}
                        label="Variable para cantidad:"
                        showAdvancedOptions={true}
                        placeholder="-- variable --"
                        showGlobal={true}
                        showTargetButtons={true}
                    />
                )}

            </Column>
        </WiredAddonBaseView>
    );
};
