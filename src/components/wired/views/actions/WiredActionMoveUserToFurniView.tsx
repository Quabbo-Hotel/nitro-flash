import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionMoveUserToFurniView: FC<{}> = props =>
{
    const { trigger = null, setIntParams = null, setUserOptions = null } = useWired();


    useEffect(() => {
        if(setUserOptions) setUserOptions(1);

    }, [trigger, setUserOptions]);

    return (
        <WiredActionBaseView
            requiresFurni={WiredFurniType.STUFF_SELECTION_OPTION_BY_ID_BY_TYPE_OR_FROM_CONTEXT}
            hasSpecialInput={true} save={null}        >
        </WiredActionBaseView>
    );
}
