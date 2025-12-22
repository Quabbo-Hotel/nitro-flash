import { FC, useEffect, useState } from 'react';
import { WiredFurniType } from '../../../../api';
import { Column, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredActionBaseView } from './WiredActionBaseView';

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

export const WiredActionRotateUserView: FC<{}> = props =>
{
    const [ direction, setDirection ] = useState(0);
    const { trigger = null, setIntParams = null } = useWired();

    useEffect(() =>
    {
        if (!trigger || !trigger.intData?.length)
        {
            setDirection(0);
            return;
        }

        setDirection(trigger.intData[0] ?? 0);
    }, [ trigger ]);

    const save = () =>
    {
        if (!setIntParams) return;
        setIntParams([ direction ]);
    };

    return (
        <WiredActionBaseView
            requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE }
            hasSpecialInput={ true }
            save={ save }>
            <Column gap={ 1 }>
                <Text center gfbold>Elige hacia dónde apuntarán los usuarios</Text>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 44px)', gap: 6, justifyContent: 'center', padding: '8px 0' }}>
                    { GRID.flat().map((cell, index) =>
                    {
                        if (cell === 'center') return <div key={ index } />;

                        const idx = cell as number;
                        const active = direction === idx;

                        return (
                            <label key={ index } style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                <input
                                    type="radio"
                                    name="wired-rotate-user"
                                    className="form-check-radio-wired"
                                    style={{ width: '23px' }}
                                    checked={ active }
                                    onChange={ () => setDirection(idx) } />
                                <span
                                    className={`icon ${ICON_CLASSES[idx]} ${active ? 'button-icons-selector-general-selected' : ''}`}
                                    style={{ width: 34, height: 36 }} />
                            </label>
                        );
                    }) }
                </div>
            </Column>
        </WiredActionBaseView>
    );
}
