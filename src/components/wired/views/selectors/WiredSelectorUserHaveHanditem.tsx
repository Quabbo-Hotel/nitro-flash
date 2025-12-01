import { FC, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { Column, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredSelectorBaseView } from './WiredSelectorBaseView';

export const WiredSelectorUserHaveHanditem: FC<{}> = () =>
{
    const [invertState, setInvertState] = useState(0);
    const [filterSelection, setFilterSelection] = useState(0);
    const { trigger = null, setIntParams = null } = useWired();
    const [handitem, setHanditem] = useState(0);

    const save = () => setIntParams([handitem]); 

    useEffect(() =>
    {
        if (trigger && trigger.intData.length > 0)
        {
            setHanditem(trigger.intData[0]);
        }
    }, [trigger]);

    return (
        <WiredSelectorBaseView hasSpecialInput={true} save={save} requiresFurni={0}>
            <Column gap={1}>
                <Text bold>{LocalizeText('wiredfurni.params.handitem')}</Text>
                <input
                    type="number"
                    className="form-control form-control-sm"
                    value={handitem}
                    onChange={e => setHanditem(parseInt(e.target.value) || 0)}
                    min={0}
                />
            </Column>
        </WiredSelectorBaseView>
    );
};
