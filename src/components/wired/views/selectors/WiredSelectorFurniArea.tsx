
import { RoomAreaSelectionManager } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { GetRoomEngine, LocalizeText } from '../../../../api';
import { Button, Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredSelectorBaseView } from './WiredSelectorBaseView';

export const WiredSelectorFurniArea: FC<{}> = () => {
    const [rootX, setRootX] = useState(0);
    const [rootY, setRootY] = useState(0);
    const [width, setWidth] = useState(0);
    const [length, setLength] = useState(0);

    const { trigger = null, setIntParams = null } = useWired();

    const save = () => setIntParams([rootX, rootY, width, length]);

    useEffect(() => {
        if (trigger?.intData?.length > 0) {
            setRootX(trigger.intData[0]);
            setRootY(trigger.intData[1]);
            setWidth(trigger.intData[2]);
            setLength(trigger.intData[3]);
        }
    }, [trigger]);


    useEffect(() => {
        GetRoomEngine().areaSelectionManager.setHighlight(rootX, rootY, width, length);
    }, [rootX, rootY, width, length]);


    useEffect(() => {
        const callback = (x: number, y: number, w: number, h: number) => {
            setRootX(x);
            setRootY(y);
            setWidth(w);
            setLength(h);
        };

        if (GetRoomEngine().areaSelectionManager.activate(callback, RoomAreaSelectionManager.HIGHLIGHT_DARKEN)) {
            GetRoomEngine().areaSelectionManager.setHighlight(rootX, rootY, width, length);
        }

        return () => {
            GetRoomEngine().areaSelectionManager.deactivate();
        };
    }, []);

    const startSelection = () => {
        GetRoomEngine().areaSelectionManager.startSelecting();
    };

    const clearSelection = () => {
        setRootX(0);
        setRootY(0);
        setWidth(0);
        setLength(0);
        GetRoomEngine().areaSelectionManager.clearHighlight();
    };

    return (
        <WiredSelectorBaseView hasSpecialInput={true} save={save} requiresFurni={0}>
            <Column gap={1}>
                <Text bold>{LocalizeText('wired_select_area_message')}</Text>
                <Text>{LocalizeText('wiredfurni.params.select.area.description')}</Text>
                <Flex gap={1}>
                    <Button variant="primary" onClick={startSelection} style={{ flex: 1 }}>
                        {LocalizeText('wired_select_area_button')}
                    </Button>
                    <Button variant="danger" onClick={clearSelection} style={{ flex: 1 }}>
                        {LocalizeText('wired_clear_area_button')}
                    </Button>
                </Flex>
            </Column>
        </WiredSelectorBaseView>
    );
};
