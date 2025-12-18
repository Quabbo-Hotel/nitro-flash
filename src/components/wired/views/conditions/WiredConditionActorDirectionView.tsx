import { FC, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks/wired/useWired';
import { WiredConditionBaseView } from './WiredConditionBaseView';

// 3x3 grid mapping (icon-neighbor indices)
const GRID: Array<Array<number | string>> = [
    [7, 0, 1],
    [6, 'center', 2],
    [5, 4, 3]
];

const ICON_CLASSES: string[] = [
    'icon-n',
    'icon-ne',
    'icon-e',
    'icon-se',
    'icon-s',
    'icon-sw',
    'icon-w',
    'icon-nw'
];

export const WiredConditionActorDirectionView: FC<{}> = props =>
{
    const { trigger = null, setIntParams = null, setAllOrOneOptions = null } = useWired();
    const [mask, setMask] = useState<number>(0);

    useEffect(() => {
        if (!trigger) return;
        if (trigger.intData && trigger.intData.length > 0) setMask(trigger.intData[0]);
        else setMask(0);
    }, [trigger]);

    const toggleBit = (idx: number) =>
    {
        const bit = (1 << idx);
        setMask(prev => (prev & bit) ? (prev & ~bit) : (prev | bit));
    };

    const save = () =>
    {
        if (setIntParams) setIntParams([mask]);
    };

    const toggleAdvanced = () =>
    {
        if (!setAllOrOneOptions) return;
        setAllOrOneOptions(prev => prev === 1 ? 0 : 1);
    };

    return (
        <WiredConditionBaseView requiresFurni={0} hasSpecialInput={true} save={save} allOrOne>
            <Column gap={1}>
                <Text center gfbold>Selecciona la dirección:</Text>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 44px)', gap: 6, justifyContent: 'center', padding: '8px 0' }}>
                    {GRID.flat().map((g, i) =>
                    {
                        if (g === 'center') return <div key={i} />;

                        const idx = g as number;
                        const active = (mask & (1 << idx)) !== 0;

                        return (
                            <label key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                <input style={{width:"20px"}} className="check-menu-wired" type="checkbox" checked={active} onChange={() => toggleBit(idx)} />
                                <span className={`icon ${ICON_CLASSES[idx]} ${active ? 'button-icons-selector-general-selected' : ''}`} style={{ width: 34, height: 36 }} />
                            </label>
                        );
                    })}
                </div>
            </Column>
        </WiredConditionBaseView>
    );
};
