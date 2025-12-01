import { GetAssetManager, IGraphicAssetCollection, NitroPoint, NitroTilemap, PixiApplicationProxy, PixiInteractionEventProxy, POINT_STRUCT_SIZE } from '@nitrots/nitro-renderer';
import { ActionSettings } from './ActionSettings';
import { FloorAction, HEIGHT_SCHEME, MAX_NUM_TILE_PER_AXIS, TILE_SIZE } from './Constants';
import { Tile } from './Tile';
import { getScreenPositionForTile, getTileFromScreenPosition } from './Utils';

type TilemapState = string[][]; // Representación simplificada para undo/redo (array 2D de alturas)

export class FloorplanEditor extends PixiApplicationProxy
{
    private static _INSTANCE: FloorplanEditor = null;

    public static readonly TILE_BLOCKED = 'r_blocked';
    public static readonly TILE_DOOR = 'r_door';

    private _tilemap: Tile[][];
    private _width: number;
    private _height: number;
    private _isHolding: boolean;
    private _doorLocation: NitroPoint;
    private _lastUsedTile: NitroPoint;
    private _tilemapRenderer: NitroTilemap;
    private _actionSettings: ActionSettings;
    private _isInitialized: boolean;

    private _assetCollection: IGraphicAssetCollection;

    // Para selección con Shift
    private _isShiftPressed: boolean = false;
    private _selectionStart: NitroPoint = null;
    private _selectionEnd: NitroPoint = null;

    // Undo/Redo
    private _undoStack: TilemapState[] = [];
    private _redoStack: TilemapState[] = [];
    private _maxHistoryLength: number = 50;

    // Bound listeners for cleanup
    private _boundKeyDown: (event: KeyboardEvent) => void = null;
    private _boundKeyUp: (event: KeyboardEvent) => void = null;

    constructor()
    {
        const width = TILE_SIZE * MAX_NUM_TILE_PER_AXIS + 20;
        const height = (TILE_SIZE * MAX_NUM_TILE_PER_AXIS) / 2 + 100;

        super({
            width: width,
            height: height,
            backgroundColor: 0x000000,
            antialias: true,
            autoDensity: true,
            resolution: 1,
            sharedLoader: true,
            sharedTicker: true
        });

        this._tilemap = [];
        this._doorLocation = new NitroPoint(0, 0);
        this._width = 0;
        this._height = 0;
        this._isHolding = false;
        this._lastUsedTile = new NitroPoint(-1, -1);
        this._actionSettings = new ActionSettings();

        this.registerKeyboardListeners();
    }

    public initialize(): void
    {
        if(this._isInitialized) return;

        const collection = GetAssetManager().getCollection('floor_editor');
        if(!collection) return;

        this._assetCollection = collection;
        this._tilemapRenderer = new NitroTilemap(collection.baseTexture);

        this.registerEventListeners();

        this.stage.addChild(this._tilemapRenderer);

        this._isInitialized = true;
    }

    private registerKeyboardListeners(): void
    {
        this._boundKeyDown = (event: KeyboardEvent) => {
            if(event.key === 'Shift') this._isShiftPressed = true;

            // Undo (Ctrl+Z)
            if(event.key.toLowerCase() === 'z' && (event.ctrlKey || event.metaKey)) {
                event.preventDefault();
                this.undo();
            }

            // Redo (Ctrl+Y or Ctrl+Shift+Z)
            if(event.key.toLowerCase() === 'y' && (event.ctrlKey || event.metaKey)) {
                event.preventDefault();
                this.redo();
            }
            if(event.key.toLowerCase() === 'z' && (event.ctrlKey || event.metaKey) && event.shiftKey) {
                event.preventDefault();
                this.redo();
            }
        };

        this._boundKeyUp = (event: KeyboardEvent) => {
            if(event.key === 'Shift') 
            {
                this._isShiftPressed = false;
                this._selectionStart = null;
                this._selectionEnd = null;
                this.renderTiles();
            }
        };

        window.addEventListener('keydown', this._boundKeyDown);
        window.addEventListener('keyup', this._boundKeyUp);
    }

    private removeKeyboardListeners(): void
    {
        if(this._boundKeyDown)
        {
            window.removeEventListener('keydown', this._boundKeyDown);
            this._boundKeyDown = null;
        }
        if(this._boundKeyUp)
        {
            window.removeEventListener('keyup', this._boundKeyUp);
            this._boundKeyUp = null;
        }
    }

    private registerEventListeners(): void
    {
        const tempPoint = new NitroPoint();

        // @ts-ignore
        this._tilemapRenderer.containsPoint = (position) =>
        {
            this._tilemapRenderer.worldTransform.applyInverse(position, tempPoint);
            return this.getTileFromPosition(tempPoint) !== null;
        };

        this._tilemapRenderer.on('pointerup', () =>
        {
            this._isHolding = false;

            if(this._isShiftPressed && this._selectionStart && this._selectionEnd)
            {
                const tilesSelected = this.getSelectionAreaSize();
                
                this.applySelectionArea();
                this._selectionStart = null;
                this._selectionEnd = null;
                this.renderTiles();
            }
        });

        this._tilemapRenderer.on('pointerout', () =>
        {
            this._isHolding = false;
        });

        this._tilemapRenderer.on('pointerdown', (event: PixiInteractionEventProxy) =>
        {
            if(!(event.data.originalEvent instanceof PointerEvent) && !(event.data.originalEvent instanceof TouchEvent)) return;

            const pointerEvent = event.data.originalEvent;
            if((pointerEvent instanceof MouseEvent) && pointerEvent.button === 2) return;

            const location = event.data.global;
            const hit = this.getTileFromPosition(location);
            if(!hit) return;

            // Guardar estado para undo antes de cambio
            this.pushUndoState();

            if(this._isShiftPressed)
            {
                if(!this._selectionStart)
                {
                    this._selectionStart = new NitroPoint(hit.x, hit.y);
                    this._selectionEnd = new NitroPoint(hit.x, hit.y);
                }
                else
                {
                    this._selectionEnd = new NitroPoint(hit.x, hit.y);
                }

                this._isHolding = true;
                this.applyCurrentActionToSelectionArea();
                this.renderTiles();
            }
            else
            {
                this._isHolding = true;
                this._lastUsedTile.x = hit.x;
                this._lastUsedTile.y = hit.y;
                this.onClick(hit.x, hit.y);
            }
        });

        this._tilemapRenderer.on('pointermove', (event: PixiInteractionEventProxy) =>
        {
            if(!this._isHolding) return;
            const location = event.data.global;

            const hit = this.getTileFromPosition(location);
            if(!hit) return;

            if(this._isShiftPressed && this._selectionStart)
            {
                this._selectionEnd = new NitroPoint(hit.x, hit.y);
                this.applyCurrentActionToSelectionArea();
                this.renderTiles();
            }
            else
            {
                if(this._lastUsedTile.x !== hit.x || this._lastUsedTile.y !== hit.y)
                {
                    // Guardar state para undo antes del cambio único (solo una vez)
                    if(!this._isHolding) this.pushUndoState();

                    this._lastUsedTile.x = hit.x;
                    this._lastUsedTile.y = hit.y;
                    this.onClick(hit.x, hit.y);
                }
            }
        });
    }

    private getTileFromPosition(position: NitroPoint): NitroPoint | null
    {
        // @ts-ignore
        const buffer = this._tilemapRenderer.pointsBuf;
        const bufSize = POINT_STRUCT_SIZE;
        const len = buffer.length;
        for(let j = 0; j < len; j += bufSize)
        {
            const bufIndex = j + bufSize;
            const data = buffer.slice(j, bufIndex);

            const width = TILE_SIZE;
            const height = TILE_SIZE / 2;

            const mousePositionX = Math.floor(position.x);
            const mousePositionY = Math.floor(position.y);

            const tileStartX = data[2];
            const tileStartY = data[3];

            const centreX = tileStartX + (width / 2);
            const centreY = tileStartY + (height / 2);

            const dx = Math.abs(mousePositionX - centreX);
            const dy = Math.abs(mousePositionY - centreY);

            const solution = (dx / (width * 0.5) + dy / (height * 0.5) <= 1);
            if(solution)
            {
                const [realX, realY] = getTileFromScreenPosition(tileStartX, tileStartY);
                return new NitroPoint(realX, realY);
            }
        }
        return null;
    }

    private getSelectionAreaSize(): number
    {
        if(!this._selectionStart || !this._selectionEnd) return 0;
        const minX = Math.min(this._selectionStart.x, this._selectionEnd.x);
        const maxX = Math.max(this._selectionStart.x, this._selectionEnd.x);
        const minY = Math.min(this._selectionStart.y, this._selectionEnd.y);
        const maxY = Math.max(this._selectionStart.y, this._selectionEnd.y);
        return (maxX - minX + 1) * (maxY - minY + 1);
    }

    private applySelectionArea(): void
    {
        if(!this._selectionStart || !this._selectionEnd) return;

        const minX = Math.min(this._selectionStart.x, this._selectionEnd.x);
        const maxX = Math.max(this._selectionStart.x, this._selectionEnd.x);
        const minY = Math.min(this._selectionStart.y, this._selectionEnd.y);
        const maxY = Math.max(this._selectionStart.y, this._selectionEnd.y);

        for(let y = minY; y <= maxY; y++)
        {
            for(let x = minX; x <= maxX; x++)
            {
                this.applyActionToTile(x, y);
            }
        }
    }

    private applyCurrentActionToSelectionArea(): void
    {
        if(!this._selectionStart || !this._selectionEnd) return;

        const minX = Math.min(this._selectionStart.x, this._selectionEnd.x);
        const maxX = Math.max(this._selectionStart.x, this._selectionEnd.x);
        const minY = Math.min(this._selectionStart.y, this._selectionEnd.y);
        const maxY = Math.max(this._selectionStart.y, this._selectionEnd.y);

        for(let y = minY; y <= maxY; y++)
        {
            for(let x = minX; x <= maxX; x++)
            {
                this.applyActionToTile(x, y);
            }
        }
    }

    private applyActionToTile(x: number, y: number): void
    {
        const tile = this._tilemap[y][x];
        const heightIndex = HEIGHT_SCHEME.indexOf(tile.height);
        let futureHeightIndex = 0;

        switch(this._actionSettings.currentAction)
        {
            case FloorAction.DOOR:
                if(tile.height !== 'x')
                {
                    this._doorLocation.x = x;
                    this._doorLocation.y = y;
                }
                return;
            case FloorAction.UP:
                if(tile.height === 'x') return;
                futureHeightIndex = heightIndex + 1;
                break;
            case FloorAction.DOWN:
                if(tile.height === 'x' || (heightIndex <= 1)) return;
                futureHeightIndex = heightIndex - 1;
                break;
            case FloorAction.SET:
                futureHeightIndex = HEIGHT_SCHEME.indexOf(this._actionSettings.currentHeight);
                break;
            case FloorAction.UNSET:
                if(tile.height === 'x') return;
                futureHeightIndex = 0;
                break;
        }
        if(futureHeightIndex === -1) return;
        if(heightIndex === futureHeightIndex) return;

        const newHeight = futureHeightIndex === 0 ? 'x' : HEIGHT_SCHEME[futureHeightIndex];

        if(newHeight !== 'x')
        {
            if((x + 1) > this._width) this._width = x + 1;
            if((y + 1) > this._height) this._height = y + 1;
        }

        this._tilemap[y][x].height = newHeight;
    }

    private onClick(x: number, y: number): void
    {
        this.applyActionToTile(x, y);
        this.renderTiles();
    }

    public renderTiles(): void
    {
        this._tilemapRenderer.clear();

        for(let y = 0; y < this._tilemap.length; y++)
        {
            for(let x = 0; x < this._tilemap[y].length; x++)
            {
                const tile = this._tilemap[y][x];
                let assetName = tile.height;

                if(tile.height === 'x') {
                    assetName = 'x';
                }
                else if(this._doorLocation.x === x && this._doorLocation.y === y) {
                    assetName = FloorplanEditor.TILE_DOOR;
                }
                else if(tile.isBlocked) {
                    assetName = FloorplanEditor.TILE_BLOCKED;
                }

                const [ positionX, positionY ] = getScreenPositionForTile(x, y);

                this._tilemapRenderer.tile(
                    this._assetCollection.getTexture(`floor_editor_${ assetName }`), 
                    positionX, 
                    positionY
                );
            }
        }
    }

    // --- Manejo Undo/Redo ---

    private pushUndoState(): void
    {
        if(!this._tilemap || this._tilemap.length === 0) return;

        // Guardar estado simplificado (array de alturas) para undo
        const state = this._tilemap.map(row => row.map(tile => tile.height));
        this._undoStack.push(state);

        // Limitar tamaño del historial
        if(this._undoStack.length > this._maxHistoryLength)
            this._undoStack.shift();

        // Al hacer nueva acción limpia el redo
        this._redoStack = [];
    }

    private restoreState(state: TilemapState): void
    {
        if(!state) return;
        for(let y = 0; y < state.length; y++)
        {
            for(let x = 0; x < state[y].length; x++)
            {
                const height = state[y][x];
                if(this._tilemap[y] && this._tilemap[y][x])
                {
                    this._tilemap[y][x].height = height;
                }
            }
        }
        this.renderTiles();
    }

    public undo(): void
    {
        if(this._undoStack.length === 0) {
            return;
        }
        // Mover estado actual a redo
        const currentState = this._tilemap.map(row => row.map(tile => tile.height));
        this._redoStack.push(currentState);

        // Restaurar último undo
        const lastState = this._undoStack.pop();
        this.restoreState(lastState);
    }

    public redo(): void
    {
        if(this._redoStack.length === 0) {
            return;
        }

        // Mover estado actual a undo
        const currentState = this._tilemap.map(row => row.map(tile => tile.height));
        this._undoStack.push(currentState);

        // Restaurar redo
        const nextState = this._redoStack.pop();
        this.restoreState(nextState);
    }


    // Métodos existentes: setTilemap, getCurrentTilemapString, clear, getters...

    public setTilemap(map: string, blockedTiles: boolean[][]): void
    {
        this._tilemap = [];
        const roomMapStringSplit = map.split('\r');

        let width = 0;
        let height = roomMapStringSplit.length;

        for(let y = 0; y < height; y++)
        {
            const originalRow = roomMapStringSplit[y];
            if(originalRow.length === 0)
            {
                roomMapStringSplit.splice(y, 1);
                height = roomMapStringSplit.length;
                y--;
                continue;
            }
            if(originalRow.length > width)
            {
                width = originalRow.length;
            }
        }
        for(let y = 0; y < height; y++)
        {
            this._tilemap[y] = [];
            const rowString = roomMapStringSplit[y];

            for(let x = 0; x < width; x++)
            {
                const blocked = (blockedTiles[y] && blockedTiles[y][x]) || false;

                const char = rowString[x];
                if(((!(char === 'x')) && (!(char === 'X')) && char))
                {
                    this._tilemap[y][x] = new Tile(char, blocked);
                }
                else
                {
                    this._tilemap[y][x] = new Tile('x', blocked);
                }
            }

            for(let x = width; x < MAX_NUM_TILE_PER_AXIS; x++)
            {
                this._tilemap[y][x] = new Tile('x', false);
            }
        }

        for(let y = height; y < MAX_NUM_TILE_PER_AXIS; y++)
        {
            if(!this._tilemap[y]) this._tilemap[y] = [];
            for(let x = 0; x < MAX_NUM_TILE_PER_AXIS; x++)
            {
                this._tilemap[y][x] = new Tile('x', false);
            }
        }

        this._width = width;
        this._height = height;
    }

    public getCurrentTilemapString(): string
    {
        const highestTile = this._tilemap[this._height - 1][this._width - 1];

        if(highestTile.height === 'x')
        {
            this._width = -1;
            this._height = -1;

            for(let y = MAX_NUM_TILE_PER_AXIS - 1; y >= 0; y--)
            {
                if(!this._tilemap[y]) continue;

                for(let x = MAX_NUM_TILE_PER_AXIS - 1; x >= 0; x--)
                {
                    if(!this._tilemap[y][x]) continue;

                    const tile = this._tilemap[y][x];

                    if(tile.height !== 'x')
                    {
                        if((x + 1) > this._width)
                            this._width = x + 1;

                        if((y + 1) > this._height)
                            this._height = y + 1;
                    }
                }
            }
        }

        const rows = [];

        for(let y = 0; y < this._height; y++)
        {
            const row = [];

            for(let x = 0; x < this._width; x++)
            {
                const tile = this._tilemap[y][x];
                row[x] = tile.height;
            }

            rows[y] = row.join('');
        }

        return rows.join('\r');
    }

    public clear(): void
    {
        this._tilemapRenderer.interactive = false;
        this._tilemap = [];
        this._doorLocation.set(-1, -1);
        this._width = 0;
        this._height = 0;
        this._isHolding = false;
        this._lastUsedTile.set(-1, -1);
        this._actionSettings.clear();
        this._tilemapRenderer.clear();

        this._selectionStart = null;
        this._selectionEnd = null;
        this._isShiftPressed = false;

        this._undoStack = [];
        this._redoStack = [];

        // Remove event listeners to prevent memory leaks
        this.removeKeyboardListeners();
        
        // Remove Pixi event listeners
        if(this._tilemapRenderer)
        {
            this._tilemapRenderer.off('pointerup');
            this._tilemapRenderer.off('pointerout');
            this._tilemapRenderer.off('pointerdown');
            this._tilemapRenderer.off('pointermove');
        }
    }

    public get tilemapRenderer(): NitroTilemap
    {
        return this._tilemapRenderer;
    }

    public get tilemap(): Tile[][]
    {
        return this._tilemap;
    }

    public get doorLocation(): NitroPoint
    {
        return this._doorLocation;
    }

    public set doorLocation(value: NitroPoint)
    {
        this._doorLocation = value;
    }

    public get actionSettings(): ActionSettings
    {
        return this._actionSettings;
    }

    public static get instance(): FloorplanEditor
    {
        if(!FloorplanEditor._INSTANCE)
        {
            FloorplanEditor._INSTANCE = new FloorplanEditor();
        }

        return FloorplanEditor._INSTANCE;
    }
}
