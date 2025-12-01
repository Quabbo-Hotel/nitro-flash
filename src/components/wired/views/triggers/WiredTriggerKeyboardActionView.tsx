import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredTriggerBaseView } from './WiredTriggerBaseView';

export const WiredTriggerKeyboardActionView: FC<{}> = props =>
{
    const [avatarMode, setAvatarMode] = useState(0);
    const { trigger = null, setIntParams = null } = useWired();

    const save = () =>
    {
        setIntParams([avatarMode]);
    };

    useEffect(() =>
    {
        const data = trigger.intData;
        setAvatarMode(data.length > 0 ? data[0] : 0);
    }, [trigger]);

    return (
        <WiredTriggerBaseView 
            requiresFurni={WiredFurniType.STUFF_SELECTION_OPTION_NONE} 
            hasSpecialInput={true} 
            save={save}>

            <Column gap={1}>
                <Text bold>{LocalizeText('wiredfurni.params.picktriggerer')}</Text>

                {[...Array(8)].map((_, index) => (
                    <Flex key={index} alignItems="center" gap={1}>
                        <input
                            className="form-check-input"
                            type="radio"
                            name="avatarMode"
                            id={`avatarMode${index}`}
                            checked={avatarMode === index}
                            onChange={() => setAvatarMode(index)} />
                        <Text>
                            {LocalizeText(`wiredfurni.params.option${index}`, ['number'], [index.toString()])}
                        </Text>
                    </Flex>
                ))}

            </Column>
        </WiredTriggerBaseView>
    );
};
