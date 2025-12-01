import { RoomEngineTriggerWidgetEvent } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { GetRoomEngine, RoomWidgetUpdateRoomObjectEvent } from '../../../../api';
import { GetFurnitureDataForRoomObject } from '../../../../api/nitro/session/GetFurnitureDataForRoomObject';
import { useObjectDoubleClickedEvent } from '../../../../hooks';

// Listens for double-clicks and triggers the Stack Height widget for MagicStack and WalkingFloor items.
export const FurnitureStackHeightHandler: FC<{}> = () =>
{
    useObjectDoubleClickedEvent((event: RoomWidgetUpdateRoomObjectEvent) =>
    {
        const { roomId, id, category } = event;

        const furniData = GetFurnitureDataForRoomObject(roomId, id, category);
        if(!furniData) return;

        const className = (furniData.className || '').toLowerCase();
        const name = (furniData.name || '').toLowerCase();

        // Magic Stack tool usually has className starting with tile_stackmagic
    const isMagicStack = className.startsWith('tile_stackmagic') || name.includes('stackmagic');
        // Walking floor may not use the tile_stackmagic base name; allow matching by name hint
    const isWalkingFloor = className.includes('walking_floor') || name.includes('walking_floor') ||
                   className.includes('walk_magic') || name.includes('walk_magic');

        if(!(isMagicStack || isWalkingFloor)) return;

    GetRoomEngine().events.dispatchEvent(new RoomEngineTriggerWidgetEvent(RoomEngineTriggerWidgetEvent.REQUEST_STACK_HEIGHT, roomId, id, category));
    });

    return null;
}
