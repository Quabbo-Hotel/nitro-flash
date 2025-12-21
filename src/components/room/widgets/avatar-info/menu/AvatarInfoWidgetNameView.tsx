import { FC, useMemo } from 'react';
import { AvatarInfoName, GetSessionDataManager } from '../../../../../api';
import { ContextMenuView } from '../../context-menu/ContextMenuView';
import { Flex } from '../../../../../common';
import { NitroConfiguration } from '@nitrots/nitro-renderer';

interface AvatarInfoWidgetNameViewProps {
    nameInfo: AvatarInfoName;
    onClose: () => void;
    fades?: boolean;
    isVariable?: boolean;
}
export const AvatarInfoWidgetNameView: FC<AvatarInfoWidgetNameViewProps> = props => {
    const { nameInfo = null, onClose = null, fades = null, isVariable = false } = props;
    
    const shouldFade = useMemo(() => {
        if (fades !== null) return fades;

        return (nameInfo.id !== GetSessionDataManager().userId);
    }, [fades, nameInfo]);

    const getClassNames = useMemo(() => {
        const newClassNames: string[] = [];

        newClassNames.push('name-only');

        return newClassNames;
    }, [nameInfo]);

    const frameName = "airplane";
    const personalizationUrl = NitroConfiguration.getValue<string>('personalization.url');

    return (
        <ContextMenuView objectId={nameInfo.roomIndex} category={nameInfo.category} userType={nameInfo.userType} fades={shouldFade} classNames={getClassNames} onClose={onClose} isVariable={isVariable} style={{ borderImageSource: `url("${personalizationUrl}/${frameName}/border.png")` }}>
            <Flex center justifyContent='center' alignItems='center' className="avatar-info-name" style={{ backgroundImage: `url("${personalizationUrl}/${frameName}/username.png")` }}>
                <Flex className='name-align' >
                    {nameInfo.name}
                </Flex>

            </Flex>
        </ContextMenuView>
    );
}
