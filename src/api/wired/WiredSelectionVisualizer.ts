import { FurnitureVisualization, IRoomObject, IRoomObjectSpriteVisualization, NitroFilter, RoomObjectCategory } from '@nitrots/nitro-renderer';
import { WiredSelectionFilter } from '.';
import { GetRoomEngine } from '..';

export class WiredSelectionVisualizer
{
    // default alpha: 0.65 -> translucent selection overlay
    // default alpha for overlay: 0.35, default line alpha: 0.95 for brighter border
    private static _selectionShader: NitroFilter = new WiredSelectionFilter([ 1, 1, 1 ], [ 0.6, 0.6, 0.6 ], 0.75, 0.95);
    private static _selectionYellowShader: NitroFilter = new WiredSelectionFilter([ 1.0, 0.85, 0.4 ], [ 0.8, 0.7, 0.3 ], 0.35, 0.95);
    private static _selectionBlueShader: NitroFilter = new WiredSelectionFilter([ 0.4, 0.6, 1.0 ], [ 0.25, 0.45, 0.9 ], 0.35, 0.95);

    public static hideSelectedWired(furniId: number): void
    {
        const roomObject = WiredSelectionVisualizer.getRoomObject(furniId);
        if (!roomObject) return;

        const visualization = (roomObject.visualization as FurnitureVisualization);
        if (!visualization) return;

        visualization.lookThroughCustom = false;
    }
    
    public static showSelectedWired(furniId: number): void
    {
        const roomObject = WiredSelectionVisualizer.getRoomObject(furniId);

        if (!roomObject) return;

        const visualization = (roomObject.visualization as FurnitureVisualization);

        if (!visualization) return;

        visualization.lookThroughCustom = true;

    }

    public static show(furniId: number): void
    {
        WiredSelectionVisualizer.applySelectionShader(WiredSelectionVisualizer.getRoomObject(furniId));
    }

    public static hide(furniId: number): void
    {
        WiredSelectionVisualizer.clearSelectionShader(WiredSelectionVisualizer.getRoomObject(furniId));
    }

    public static clearSelectionShaderFromFurni(furniIds: number[]): void
    {
        for(const furniId of furniIds)
        {
            WiredSelectionVisualizer.clearSelectionShader(WiredSelectionVisualizer.getRoomObject(furniId));
        }
    }

    public static applySelectionShaderToFurni(furniIds: number[]): void
    {
        for(const furniId of furniIds)
        {
            WiredSelectionVisualizer.applySelectionShader(WiredSelectionVisualizer.getRoomObject(furniId));
        }
    }

    public static applySelectionShaderToFurniYellow(furniIds: number[]): void
    {
        for(const furniId of furniIds)
        {
            WiredSelectionVisualizer.applySelectionShaderWithFilter(WiredSelectionVisualizer.getRoomObject(furniId), WiredSelectionVisualizer._selectionYellowShader);
        }
    }

    public static clearSelectionShaderFromFurniYellow(furniIds: number[]): void
    {
        for(const furniId of furniIds)
        {
            WiredSelectionVisualizer.clearSelectionShader(WiredSelectionVisualizer.getRoomObject(furniId));
        }
    }

    public static applySelectionShaderToFurniBlue(furniIds: number[]): void
    {
        for(const furniId of furniIds)
        {
            WiredSelectionVisualizer.applySelectionShaderWithFilter(WiredSelectionVisualizer.getRoomObject(furniId), WiredSelectionVisualizer._selectionBlueShader);
        }
    }

    public static clearSelectionShaderFromFurniBlue(furniIds: number[]): void
    {
        for(const furniId of furniIds)
        {
            WiredSelectionVisualizer.clearSelectionShader(WiredSelectionVisualizer.getRoomObject(furniId));
        }
    }

    private static getRoomObject(objectId: number): IRoomObject
    {
        const roomEngine = GetRoomEngine();

        return roomEngine.getRoomObject(roomEngine.activeRoomId, objectId, RoomObjectCategory.FLOOR);
    }

    private static applySelectionShader(roomObject: IRoomObject): void
    {
        if(!roomObject) return;

        const visualization = (roomObject.visualization as IRoomObjectSpriteVisualization);

        if(!visualization) return;

        for(const sprite of visualization.sprites)
        {
            if(sprite.blendMode === 1) continue; // BLEND_MODE: ADD

            sprite.filters = [ WiredSelectionVisualizer._selectionShader ];
        }
    }

    private static applySelectionShaderWithFilter(roomObject: IRoomObject, filter: NitroFilter): void
    {
        if(!roomObject) return;

        const visualization = (roomObject.visualization as IRoomObjectSpriteVisualization);

        if(!visualization) return;

        for(const sprite of visualization.sprites)
        {
            if(sprite.blendMode === 1) continue; // BLEND_MODE: ADD

            sprite.filters = [ filter ];
        }
    }

    private static clearSelectionShader(roomObject: IRoomObject): void
    {
        if(!roomObject) return;

        const visualization = (roomObject.visualization as IRoomObjectSpriteVisualization);

        if(!visualization) return;

        for(const sprite of visualization.sprites) sprite.filters = [];
    }
}