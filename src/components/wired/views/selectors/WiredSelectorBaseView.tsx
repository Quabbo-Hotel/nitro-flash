import { WiredSelectorDefinition } from '@nitrots/nitro-renderer';
import { FC, PropsWithChildren, useEffect } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredBaseView } from '../WiredBaseView';

export interface WiredSelectorBaseViewProps
{
    hasSpecialInput: boolean;
    requiresFurni: number;
    save: () => void;
}

export const WiredSelectorBaseView: FC<PropsWithChildren<WiredSelectorBaseViewProps>> = props =>
{
    const { requiresFurni = WiredFurniType.STUFF_SELECTION_OPTION_NONE, save = null, hasSpecialInput = false, children = null } = props;
    const { trigger = null,
        isFiltered = 0,
        setIsFiltered = null,
        isInverted = 0,
        setIsInverted = null,
    } = useWired();


    useEffect(() =>
    {
        setIsFiltered((trigger as WiredSelectorDefinition).isFiltered);
        setIsInverted((trigger as WiredSelectorDefinition).isInverted)

    }, [trigger,
        setIsFiltered,
        setIsInverted
    ]);

    return (
        <WiredBaseView wiredType="selector" requiresFurni={requiresFurni} save={save} hasSpecialInput={hasSpecialInput}>
            {children}
            <Text bold>{LocalizeText('wiredfurni.params.select.options')}</Text>
            <div>
                <Flex gap={1}>
                    <input
                        type="checkbox"
                        checked={isFiltered === 1}
                        onChange={(e) => setIsFiltered(e.target.checked ? 1 : 0)}
                    />
                    <Text>{LocalizeText('wiredfurni.params.filter.selection')}</Text>
                </Flex>
                <Flex gap={1}>
                    <input
                        type="checkbox"
                        checked={isInverted === 1}
                        onChange={(e) => setIsInverted(e.target.checked ? 1 : 0)}
                    />
                    <Text>{LocalizeText('wiredfurni.params.invert.selection')}</Text>
                </Flex>
            </div>
        </WiredBaseView>
    );
};
