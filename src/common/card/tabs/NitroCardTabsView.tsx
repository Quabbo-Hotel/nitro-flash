import { FC, useMemo } from 'react';
import { Flex, FlexProps } from '../..';

interface NitroCardTabsProps extends FlexProps {
    subClassName?: string;
    isCentered?: boolean;
}
export const NitroCardTabsView: FC<NitroCardTabsProps> = props => {
    const { justifyContent: propJustifyContent = 'flex-start', gap = 1, classNames = [], children = null, subClassName = '', isCentered = false, ...rest } = props;

    const getClassNames = useMemo(() => {
        const newClassNames: string[] = ['container-fluid', 'nitro-card-tabs', 'pt-1', 'position-relative'];

        if (classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [classNames]);

    return (
        <>
            {isCentered ? (
                <Flex center classNames={getClassNames} {...rest}>
                    <ul className={'nav nav-tabs border-0 ' + subClassName}>
                        {children}
                    </ul>
                </Flex>
            ) : (
                <Flex classNames={getClassNames} {...rest}>
                    <ul className={'nav nav-tabs border-0 ' + subClassName}>
                        {children}
                    </ul>
                </Flex>
            )}
        </>
    );

}
