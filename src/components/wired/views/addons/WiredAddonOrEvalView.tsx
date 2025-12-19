import { FC, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { Column, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredAddonBaseView } from './WiredAddonBaseView';

export const WiredAddonOrEvalView: FC = () => {
    const [mode, setMode] = useState<number>(0);
    const [value, setValue] = useState<number>(0);
    const { trigger = null, setIntParams = null } = useWired();

    const save = () => setIntParams([mode, value]);

    useEffect(() => {
        if (trigger && trigger.intData) {
            setMode(trigger.intData[0] ?? 0);
            setValue(trigger.intData[1] ?? 0);
        } else {
            setMode(0);
            setValue(0);
        }
    }, [trigger]);

    return (
        <WiredAddonBaseView hasSpecialInput={true} save={save} requiresFurni={0}>
            <Column gap={1}>
                <Text gfbold>Complemento WIRED: Lógica de Condición</Text>

                <div><label><input className='form-check-radio-wired' type="radio" name="or_mode" checked={mode === 0} onChange={() => setMode(0)} /> Todas</label></div>
                <div><label><input className='form-check-radio-wired' type="radio" name="or_mode" checked={mode === 1} onChange={() => setMode(1)} /> Al menos una</label></div>
                <div><label><input className='form-check-radio-wired' type="radio" name="or_mode" checked={mode === 2} onChange={() => setMode(2)} /> No todas</label></div>
                <div><label><input className='form-check-radio-wired' type="radio" name="or_mode" checked={mode === 3} onChange={() => setMode(3)} /> Ninguna</label></div>

                <hr className="m-0 bg-dark" />

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label><input className='form-check-radio-wired' type="radio" name="or_mode" checked={mode === 4} onChange={() => setMode(4)} /> Menos de:</label>
                    {mode === 4 && <input type="number" style={{width:"40px"}} className="form-control form-control-sm" min={0} value={value} onChange={e => setValue(parseInt(e.target.value || '0'))} />}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label><input className='form-check-radio-wired' type="radio" name="or_mode" checked={mode === 5} onChange={() => setMode(5)} /> Más de:</label>
                    {mode === 5 && <input type="number" style={{width:"40px"}} className="form-control form-control-sm" min={0} value={value} onChange={e => setValue(parseInt(e.target.value || '0'))} />}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label><input className='form-check-radio-wired' type="radio" name="or_mode" checked={mode === 6} onChange={() => setMode(6)} /> Exactamente:</label>
                    {mode === 6 && <input type="number" style={{width:"40px"}} className="form-control form-control-sm" min={0} value={value} onChange={e => setValue(parseInt(e.target.value || '0'))} />}
                </div>
            </Column>
        </WiredAddonBaseView>
    );
};
