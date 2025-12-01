import { FC, useEffect, useState } from 'react';
import { WiredFurniType } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredActionBaseView } from './WiredActionBaseView';
import { VariableSelectorComponent } from './components';

const OPS = [
  { code: 0, label: 'Asignar' },
  { code: 1, label: 'Sumar' },
  { code: 2, label: 'Restar' },
  { code: 3, label: 'Multiplicar' },
  { code: 4, label: 'Dividir' },
  { code: 5, label: 'Potencia' },
  { code: 6, label: 'Módulo' },
  { code: 7, label: 'Configurar mínimo' },
  { code: 8, label: 'Configurar máximo' },
  { code: 9, label: 'Aleatorio (0..valor)' },
  { code: 10, label: 'Valor absoluto' },
  { code: 11, label: 'Bitwise AND' },
  { code: 12, label: 'Bitwise OR' },
  { code: 13, label: 'Bitwise XOR' },
  { code: 14, label: 'Bitwise NOT' },
  { code: 15, label: 'Desplazar izquierda <<' },
  { code: 16, label: 'Desplazar derecha >>' }
];

export const WiredActionChangeValueVariableView: FC = () => {
  const { trigger = null, setStringParam = null, setIntParams = null } = useWired();

  const [target, setTarget] = useState('');
  const [op, setOp] = useState(0);
  const [mode, setMode] = useState(0);
  const [literal, setLiteral] = useState(0);
  const [targetType, setTargetType] = useState(0);
  const [source, setSource] = useState('');
  const [sourceType, setSourceType] = useState(0);
  const [typeOfAdvancedOptionOne, setTypeOfAdvancedOptionOne] = useState(4);
  const [typeOfAdvancedOptionTwo, setTypeOfAdvancedOptionTwo] = useState(4);

  // Cargar configuración previa
  useEffect(() => {
    if (!trigger) return;
    if (trigger.stringData) {
      const [t, s] = trigger.stringData.split('::');
      setTarget(t || '');
      if (s) setSource(s);
    }
    if (trigger.intData.length >= 5) {
      setOp(trigger.intData[0] ?? 0);
      setMode(trigger.intData[1] ?? 0);
      setLiteral(trigger.intData[2] ?? 0);
      setTargetType(trigger.intData[3] ?? 0);
      setSourceType(trigger.intData[4] ?? 0);
    }
    if (trigger.intData.length >= 6) {
      setTypeOfAdvancedOptionOne(trigger.intData[5] ?? 4);
    }
    if (trigger.intData.length >= 7) {
      setTypeOfAdvancedOptionTwo(trigger.intData[6] ?? 4);
    }
  }, [trigger?.id]);

  // Guardar
  const save = () => {
    const packed = mode === 1 ? `${target}::${source}` : target;
    setStringParam(packed);
    setIntParams([op, mode, literal, targetType, sourceType, typeOfAdvancedOptionOne, typeOfAdvancedOptionTwo]);
  };

  return (
    <WiredActionBaseView
      requiresFurni={WiredFurniType.STUFF_SELECTION_OPTION_BY_ID}
      hasSpecialInput
      save={save}
    >
      <Column gap={1}>
        <VariableSelectorComponent
          selectedVariable={target}
          onVariableChange={setTarget}
          targetType={targetType}
          onTargetTypeChange={setTargetType}
          typeOfAdvancedOption={typeOfAdvancedOptionOne}
          onAdvancedOptionChange={setTypeOfAdvancedOptionOne}
          label="Variable objetivo:"
          showAdvancedOptions={true}
          placeholder="-- variable --"
          filterType="hasValue"
        />

        <Text bold>Operación</Text>
        <select
          className='form-select'
          style={{ width: '100%', appearance: 'menulist', paddingLeft: '5px' }}
          value={op}
          onChange={e => setOp(parseInt(e.target.value))}
        >
          {OPS.map(o => (
            <option key={o.code} value={o.code}>{o.label}</option>
          ))}
        </select>

        <Text bold>Fuente del valor</Text>
        <Flex gap={1} alignItems='center'>
          <input type='radio' name='mode' checked={mode === 0} onChange={() => setMode(0)} />
          <Text small>Definir valor</Text>
          <input type='radio' name='mode' checked={mode === 1} onChange={() => setMode(1)} />
          <Text small>A partir de variable</Text>
        </Flex>

        {mode === 0 && (
          <input
            type='number'
            className='form-control form-control-sm'
            style={{ paddingLeft: '5px' }}
            value={literal}
            onChange={e => setLiteral(parseInt(e.target.value) || 0)}
          />
        )}

        {mode === 1 && (
          <VariableSelectorComponent
            selectedVariable={source}
            onVariableChange={setSource}
            targetType={sourceType}
            onTargetTypeChange={setSourceType}
            typeOfAdvancedOption={typeOfAdvancedOptionTwo}
            onAdvancedOptionChange={setTypeOfAdvancedOptionTwo}
            label="Variable fuente:"
            showAdvancedOptions={true}
            placeholder="-- variable fuente --"
            filterType="hasValue"
          />
        )}
      </Column>
    </WiredActionBaseView>
  );
};
