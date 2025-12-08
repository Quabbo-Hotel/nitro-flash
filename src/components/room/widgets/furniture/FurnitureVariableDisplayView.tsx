import { RoomObjectCategory } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { Column, Flex, Text } from '../../../../common';

import { useFurnitureVariableDisplayWidget } from '../../../../hooks';
import { ContextMenuListView } from '../context-menu/ContextMenuListView';
import { ObjectLocationView } from '../object-location/ObjectLocationView';

export const FurnitureVariableDisplayView: FC<{}> = props => {
    const { displayData } = useFurnitureVariableDisplayWidget();

    if (!displayData || displayData.size === 0) return null;

    return (
        <>
            {Array.from(displayData.entries()).map(([virtualId, data], index) => {
                return (
                    <ObjectLocationView key={`var-display-${virtualId}`} objectId={virtualId} category={RoomObjectCategory.FLOOR}>
                        <Column className="variable-only var-context-menu">
                            <ContextMenuListView overflow="hidden" gap={1} className="h-100">
                                <Flex alignItems="center" justifyContent="center">
                                    <Text center>
                                        {data.label ?? (data.value !== null ? data.value : 'No Value')}
                                    </Text>
                                </Flex>
                            </ContextMenuListView>
                        </Column>
                    </ObjectLocationView>
                );
            })}
        </>
    );
};
