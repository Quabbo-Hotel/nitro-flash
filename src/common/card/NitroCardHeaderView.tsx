import { FC, MouseEvent, useMemo } from 'react';
import { FaFlag, FaTimes } from 'react-icons/fa';
import { Base, Column, ColumnProps, Flex } from '..';

interface NitroCardHeaderViewProps extends ColumnProps {
    headerText: string;
    isInfoToHabboPages?: boolean;
    isWired?: boolean;
    isGalleryPhoto?: boolean;
    noCloseButton?: boolean;
    hideButtonClose?: boolean;
    onReportPhoto?: (event: MouseEvent) => void;
    onCloseClick: (event: MouseEvent) => void;
    onClickInfoHabboPages?: (event: MouseEvent) => void;
}

export const NitroCardHeaderView: FC<NitroCardHeaderViewProps> = props => {
    const { headerText = null, onClickInfoHabboPages = null, isInfoToHabboPages = false, isWired = false, isGalleryPhoto = false, noCloseButton = false, hideButtonClose = false, onReportPhoto = null, onCloseClick = null, justifyContent = 'center', alignItems = 'center', classNames = [], children = null, ...rest } = props;

    const getClassNames = useMemo(() => {
        const newClassNames: string[] = ['drag-handler', 'container-fluid', 'nitro-card-header'];

        if (classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [classNames]);

    const onMouseDown = (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
    }

    return (
        <Column center position="relative" classNames={getClassNames} {...rest}>
            <Flex fullWidth center className="nitro-card-header-holder">
                {isInfoToHabboPages &&
                    <Base position="absolute" className="end-6 nitro-card-header-info-habbopages" onClick={onClickInfoHabboPages}></Base>
                }
                {isGalleryPhoto &&
                    <>
                        <span className="nitro-card-header-text">{headerText}</span><Base position="absolute" className="end-4 nitro-card-header-report-camera" onClick={onReportPhoto}>
                            <FaFlag className="fa-icon" />
                        </Base>
                    </>
                }
                {isWired &&
                    <>
                        <span className="header-wired-text">{headerText}</span>
                        <Flex center position="absolute" className="end-2" onMouseDownCapture={onMouseDown} onClick={onCloseClick}>
                            <Flex className='container-btn-close-wired' center>
                                <Flex className="btn-close-wired" center>

                                </Flex>
                            </Flex>
                        </Flex></>
                }
                {!isWired &&
                    <>
                        <span className="nitro-card-header-text">{headerText}</span><Flex center position="absolute" className="end-2 nitro-card-header-close" onMouseDownCapture={onMouseDown} onClick={onCloseClick}>
                            {(!hideButtonClose) && <FaTimes className="fa-icon w-12 h-12" />}
                        </Flex>
                    </>
                }
            </Flex>
            {children}
        </Column>
    );
}
