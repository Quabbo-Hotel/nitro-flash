// BulkObjectsRollingParser.ts
import { IMessageDataWrapper, IMessageParser, Vector3d } from '../../../../../../api';

export class BulkObjectsRollingParser implements IMessageParser {
    private _movements: BulkMovement[];
    private _animationTime: number;
    private _rollerId: number;

    public flush(): boolean {
        this._movements = [];
        this._animationTime = 500;
        this._rollerId = 0;
        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean {
        if (!wrapper) return false;
        
        try {
            const jsonData = wrapper.readString();
            
            // Verificar que el JSON esté completo
            if (!this.isJsonComplete(jsonData)) {
                console.warn('[BulkRollingParser] JSON incompleto recibido');
                return false;
            }
            
            const data = JSON.parse(jsonData);
            this._movements = [];
            this._animationTime = data.animationTime || 500;
            this._rollerId = data.rollerItemId || 0;
            
            if (data.movements && Array.isArray(data.movements)) {
                for (const movement of data.movements) {
                    try {
                        // Validar campos requeridos
                        if (!movement.type || movement.id === undefined) {
                            console.warn('[BulkRollingParser] Movimiento inválido, campos faltantes');
                            continue;
                        }
                        
                        const from = new Vector3d(
                            Number(movement.fromX) || 0,
                            Number(movement.fromY) || 0,
                            parseFloat(movement.fromZ) || 0
                        );
                        
                        const to = new Vector3d(
                            Number(movement.toX) || 0,
                            Number(movement.toY) || 0,
                            parseFloat(movement.toZ) || 0
                        );
                        
                        if (movement.type === 'avatar') {
                            this._movements.push(new BulkMovement(
                                'avatar',
                                movement.avatarId || movement.id,
                                from,
                                to,
                                null,
                                this._animationTime,
                                movement.posture || null,
                                movement.postureParam || null
                            ));
                        } else {
                            this._movements.push(new BulkMovement(
                                'item',
                                movement.itemId || movement.id,
                                from,
                                to,
                                Number(movement.rotation) || 0,
                                this._animationTime,
                                null,
                                null
                            ));
                        }
                    } catch (movementError) {
                        console.warn('[BulkRollingParser] Error procesando movimiento individual:', movementError);
                        continue;
                    }
                }
                
                console.log(`[BulkRollingParser] Parseados ${this._movements.length} movimientos correctamente`);
                return true;
            }
            
            return true;
        } catch (e) {
            console.error('[BulkRollingParser] Error parsing JSON:', e);
            // Mostrar solo el inicio del JSON para debug
            try {
                const jsonData = wrapper.readString();
                console.error('[BulkRollingParser] JSON (primeros 200 chars):', jsonData.substring(0, 200));
            } catch (readError) {
                console.error('[BulkRollingParser] No se pudo leer el JSON');
            }
            return false;
        }
    }

    private isJsonComplete(jsonString: string): boolean {
        if (!jsonString) return false;
        
        const trimmed = jsonString.trim();
        if (trimmed.length === 0) return false;
        
        // Verificar que empiece con { y termine con }
        if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) {
            return false;
        }
        
        // Contar llaves para verificar que estén balanceadas
        const openBraces = (trimmed.match(/{/g) || []).length;
        const closeBraces = (trimmed.match(/}/g) || []).length;
        
        if (openBraces !== closeBraces) {
            console.warn(`[BulkRollingParser] Llaves desbalanceadas: ${openBraces} vs ${closeBraces}`);
            return false;
        }
        
        return true;
    }

    public get movements(): BulkMovement[] {
        return this._movements || [];
    }

    public get animationTime(): number {
        return this._animationTime;
    }

    public get rollerId(): number {
        return this._rollerId;
    }
}

export class BulkMovement {
    constructor(
        public type: string,
        public id: number,
        public from: Vector3d,
        public to: Vector3d,
        public rotation: number | null,
        public animationTime: number,
        public posture: string | null,
        public postureParam: string | null
    ) {}
}