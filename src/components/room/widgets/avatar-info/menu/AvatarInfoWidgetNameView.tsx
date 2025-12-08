import { FC, useMemo } from 'react';
import { AvatarInfoName, GetSessionDataManager } from '../../../../../api';
import { ContextMenuView } from '../../context-menu/ContextMenuView';

interface AvatarInfoWidgetNameViewProps
{
    nameInfo: AvatarInfoName;
    onClose: () => void;
    fades?: boolean;
    isVariable?: boolean;
}

export const AvatarInfoWidgetNameView: FC<AvatarInfoWidgetNameViewProps> = props =>
{
    const { nameInfo = null, onClose = null, fades = null, isVariable = false } = props;
    const shouldFade = useMemo(() =>
    {
        if(fades !== null) return fades;

        return (nameInfo.id !== GetSessionDataManager().userId);
    }, [ fades, nameInfo ]);

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'name-only' ];

        if(nameInfo.isFriend) newClassNames.push('is-friend');

        return newClassNames;
    }, [ nameInfo ]);

    return (
        <ContextMenuView objectId={ nameInfo.roomIndex } category={ nameInfo.category } userType={ nameInfo.userType } fades={ shouldFade } classNames={ getClassNames } onClose={ onClose } isVariable={ isVariable }>
            <div className="text-shadow">
                { nameInfo.name }
            </div>
        </ContextMenuView>
    );
}
