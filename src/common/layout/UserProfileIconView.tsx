import { FC, useMemo } from 'react';
import { GetUserProfile } from '../../api';
import { GetProfilePicUrl } from '../../api/assets';
import { Base, BaseProps } from '../Base';

export interface UserProfileIconViewProps extends BaseProps<HTMLDivElement>
{
    userId?: number;
    userName?: string;
}

export const UserProfileIconView: FC<UserProfileIconViewProps> = props =>
{
    const { userId = 0, userName = null, classNames = [], pointer = true, children = null, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'nitro-friends-spritesheet', 'icon-profile-sm' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    return (
        <Base classNames={ getClassNames } pointer={ pointer } onClick={ event => GetUserProfile(userId) } { ... rest }>
            { userName &&
                <img src={ GetProfilePicUrl(userName) } alt="profile" style={ { width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' } } onError={ e => { (e.target as HTMLImageElement).style.display = 'none'; } } /> }
            { !userName && children }
        </Base>
    );
}
