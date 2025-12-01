import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredTriggerBaseView } from './WiredTriggerBaseView';

export const WiredTriggerAvatarSaysSomethingView: FC<{}> = props =>
{
    const [ message, setMessage ] = useState('');
    const [ isHidden, setIsHidden ] = useState(-1);
    const [ onlyOwner, setOnlyOwner ] = useState(-1);
    const [ mode, setMode ] = useState(-1);
    const { trigger = null, setStringParam = null, setIntParams = null } = useWired();

    const save = () =>
    {
        setStringParam(message);
        setIntParams([ isHidden, onlyOwner, mode ]);
    }

    useEffect(() =>
    {
        setMessage(trigger.stringData);
        setIsHidden((trigger.intData.length > 0) ? trigger.intData[0] : 0);
        setOnlyOwner((trigger.intData.length > 1) ? trigger.intData[1] : 0);
        setMode((trigger.intData.length > 2) ? trigger.intData[2] : 0);
    }, [ trigger ]);
    
    return (
        <WiredTriggerBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            
            { mode !== 2 && (
                <Column gap={ 1 }>
                    <Text gfbold>{ LocalizeText('wiredfurni.params.whatissaid') }</Text>
                    <input 
                        type="text" 
                        className="form-control form-control-sm" 
                        value={ message } 
                        onChange={ event => setMessage(event.target.value) } 
                    />
                </Column>
            )}

            <Column gap={1}>
                <Text bold>{LocalizeText('wired_select_mode_u_want')}</Text>
                {[0, 1, 2].map(mode2 =>
                    <Flex key={mode2} gap={1}>
                        <input
                            type="radio"
                            name="wiredToggle"
                            checked={(mode === mode2)}
                            onChange={() => setMode(mode2)}
                        />
                        <Text>{LocalizeText('wired.params.saysmth.' + mode2)}</Text>
                    </Flex>
                )}
            </Column>

            <hr className="m-0 bg-dark" />
            <Text bold>{LocalizeText('wiredfurni.params.select.options')}</Text>
            <div>
                <Flex gap={1}>
                    <input
                        type="checkbox"
                        checked={isHidden === 1}
                        onChange={(e) => setIsHidden(e.target.checked ? 1 : 0)}
                    />
                    <Text>{LocalizeText('Ocultar mensaje de activación')}</Text>
                </Flex>
                <Flex gap={1}>
                    <input
                        type="checkbox"
                        checked={onlyOwner === 1}
                        onChange={(e) => setOnlyOwner(e.target.checked ? 1 : 0)}
                    />
                    <Text>{LocalizeText('Solamente puede ser accionado por el dueño de la sala')}</Text>
                </Flex>
            </div>
        </WiredTriggerBaseView>
    );
}
