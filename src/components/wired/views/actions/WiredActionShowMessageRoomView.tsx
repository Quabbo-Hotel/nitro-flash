import { FC, useEffect, useState } from 'react';
import { GetConfiguration, LocalizeText, WiredFurniType } from '../../../../api';
import { Column, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionShowMessageRoomView: FC<{}> = props =>
{
    const [ message, setMessage ] = useState('');
    const { trigger = null, setStringParam = null, setFurniOptions = null, setUserOptions = null } = useWired();

    useEffect(() =>
    {
        setMessage(trigger?.stringData || '');
    }, [ trigger ]);

    useEffect(() =>
    {
        setFurniOptions && setFurniOptions(0);
        setUserOptions && setUserOptions(0);
    }, [ setFurniOptions, setUserOptions ]);

    const save = () =>
    {
        if (!setStringParam) return;
        setStringParam(message);
    };

    return (
        <WiredActionBaseView
            requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE }
            hasSpecialInput={ true }
            save={ save }>
            <Column gap={ 1 }>
                <Text gfbold>{ LocalizeText('wiredfurni.params.message') }</Text>
                <input
                    type="text"
                    className="form-control form-control-sm"
                    value={ message }
                    onChange={ event => setMessage(event.target.value) }
                    maxLength={ GetConfiguration<number>('wired.action.chat.max.length', 100) } />
            </Column>
        </WiredActionBaseView>
    );
}
