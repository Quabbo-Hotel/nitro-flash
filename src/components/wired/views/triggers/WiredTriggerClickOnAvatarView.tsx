import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredTriggerBaseView } from './WiredTriggerBaseView';

export const WiredTriggerClickOnAvatarView: FC<{}> = props =>
{
    const [avatarMode, setAvatarMode] = useState(0);
    const { trigger = null, setStringParam = null, setIntParams = null } = useWired();
    const [wiredAction, setWiredAction] = useState(0);
    const [wiredReach, setWiredReach] = useState(0);

    const save = () =>
    {
        // No usamos stringParam aquí
        setStringParam('');
        // Enviamos wiredAction, wiredReach, avatarMode
        setIntParams([wiredAction, wiredReach, avatarMode]);
    };

    useEffect(() =>
    {
        if(trigger?.intData?.length >= 3)
        {
            setWiredAction(trigger.intData[0]);
            setWiredReach(trigger.intData[1]);
            setAvatarMode(trigger.intData[2]);
        }
        else
        {
            setWiredAction(trigger?.intData?.length > 0 ? trigger.intData[0] : 2);
            setWiredReach(trigger?.intData?.length > 1 ? trigger.intData[1] : 2);
            setAvatarMode(0);
        }
    }, [trigger]);

    return (
        <WiredTriggerBaseView requiresFurni={WiredFurniType.STUFF_SELECTION_OPTION_NONE} hasSpecialInput={true} save={save}>
            <Column gap={1}>
                <Text bold>{LocalizeText('wiredfurni.params.picktriggerer')}</Text>
                <Flex alignItems="center" gap={1}>
                    <input className="form-check-input" type="radio" name="avatarMode" id="avatarMode0" checked={avatarMode === 0} onChange={() => setAvatarMode(0)} />
                    <Text>{LocalizeText('wiredfurni.params.anyavatar')}</Text>
                </Flex>
                <Flex alignItems="center" gap={1}>
                    <input className="form-check-input" type="radio" name="avatarMode" id="avatarMode1" checked={avatarMode === 1} onChange={() => setAvatarMode(1)} />
                    <Text>{LocalizeText('wiredfurni.params.onlyroomowner')}</Text> {/* Añade esta clave en localización */}
                </Flex>
            </Column>
            <hr className="m-0 bg-dark" />

            <Column gap={1}>
                <Text bold>{LocalizeText('Aplicar acciones en:')}</Text>
                {[0, 1].map(mode =>
                {
                    return (
                        <Flex key={mode} gap={1}>
                            <input
                                className="form-check-input"
                                type="radio"
                                name="wiredAction"
                                id={`wiredAction${mode}`}
                                checked={wiredAction === mode}
                                onChange={() => setWiredAction(mode)} />
                            <Text>{LocalizeText('action' + mode)}</Text>
                        </Flex>
                    );
                })}
            </Column>
            <hr className="m-0 bg-dark" />

            <Column gap={1}>
                <Text bold>{LocalizeText('reach')}</Text>
                {[0, 1].map(mode =>
                {
                    return (
                        <Flex key={mode} gap={1}>
                            <input
                                className="form-check-input"
                                type="radio"
                                name="wiredReach"
                                id={`wiredReach${mode}`}
                                checked={wiredReach === mode}
                                onChange={() => setWiredReach(mode)} />
                            <Text>{LocalizeText('reach' + mode)}</Text>
                        </Flex>
                    );
                })}
            </Column>
        </WiredTriggerBaseView>
    );
};
