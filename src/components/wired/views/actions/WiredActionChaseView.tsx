import { FC, useEffect, useState } from 'react';
import { WiredFurniType } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionChaseView: FC<{}> = props =>
{
    const [ neverMove, setNeverMove ] = useState(false);
    const { trigger = null, setIntParams = null } = useWired();

    useEffect(() =>
    {
        if (!trigger || !trigger.intData?.length)
        {
            setNeverMove(false);
            return;
        }

        setNeverMove(trigger.intData[0] === 1);
    }, [ trigger ]);

    const save = () =>
    {
        if (!setIntParams) return;
        setIntParams([ neverMove ? 1 : 0 ]);
    };

    return (
        <WiredActionBaseView
            requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_BY_ID_BY_TYPE_OR_FROM_CONTEXT }
            hasSpecialInput={ true }
            save={ save }>
            <Column gap={ 1 }>
                <Flex alignItems="center" gap={ 1 }>
                    <input
                        className="check-menu-wired"
                        type="checkbox"
                        checked={ neverMove }
                        onChange={ event => setNeverMove(event.target.checked) } />
                    <Text style={{textIndent:"10px"}}>Evitar que el furni se mueva</Text>
                </Flex>
            </Column>
        </WiredActionBaseView>
    );
}
