import { GetFurniFixToolFurniDataEvent, RoomAreaSelectionManager } from '@nitrots/nitro-renderer';
import { FurniFixToolBatchSaveResponseEvent } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/room/engine/FurniFixToolBatchSaveResponseEvent';
import { FurniFixToolBatchSaveMessageComposer } from '@nitrots/nitro-renderer/src/nitro/communication/messages/outgoing/room/engine/FurniFixToolBatchSaveMessageComposer';
import { FurniFixToolSaveMessageComposer } from '@nitrots/nitro-renderer/src/nitro/communication/messages/outgoing/room/engine/FurniFixToolSaveMessageComposer';
import { IsOnFurniFixMessageComposer } from '@nitrots/nitro-renderer/src/nitro/communication/messages/outgoing/room/engine/IsOnFurniFixMessageComposer';
import { FC, useEffect, useState } from 'react';
import { GetCommunication, GetConfiguration, GetNitroInstance, GetRoomEngine, GetSessionDataManager, SendMessageComposer } from '../../../../api';
import { NitroCardHeaderView, NitroCardView } from '../../../../common';
import { useMessageEvent } from '../../../../hooks';

interface FurniFixToolViewProps
{
    onCloseClick: () => void;
}

const numericFields = new Set([
    'id', 'spriteId', 'width', 'length', 'stackHeight',
    'interactionModesCount', 'pageId', 'costCredits', 'costPixels',
    'costDiamonds', 'amount', 'orderNum', 'flatId'
]);

const stringFields = new Set([
    'publicName', 'itemName', 'interactionType', 'vendingIds', 'variableHeights', 'catalogName'
]);

const catalogFields = new Set([
    'pageId', 'catalogName', 'costCredits', 'costPixels',
    'costDiamonds', 'amount', 'orderNum', 'flatId'
]);

export const FurniFixToolView: FC<FurniFixToolViewProps> = ({ onCloseClick }) =>
{
    const isMod = GetSessionDataManager().isModerator;
    const [furniData, setFurniData] = useState<any>({});
    const [showCatalogOptions, setShowCatalogOptions] = useState(false);
    const [catalogEdited, setCatalogEdited] = useState(false);
    const [catalogSnapshot, setCatalogSnapshot] = useState<any>({});
    const [isAreaSelectionMode, setIsAreaSelectionMode] = useState(false);
    const [selectedFurnis, setSelectedFurnis] = useState<any[]>([]);
    const [batchEditMode, setBatchEditMode] = useState(false);
    const [selectedProperties, setSelectedProperties] = useState<Set<string>>(new Set());
    const [batchData, setBatchData] = useState<any>({});
    const [rootX, setRootX] = useState(0);
    const [rootY, setRootY] = useState(0);
    const [width, setWidth] = useState(0);
    const [length, setLength] = useState(0);

    useEffect(() =>
    {
        if (isMod) GetCommunication().connection.send(new IsOnFurniFixMessageComposer(isMod, true));
        return () => { if (isMod) GetCommunication().connection.send(new IsOnFurniFixMessageComposer(isMod, false)); };
    }, [isMod]);

    useEffect(() =>
    {
        if (batchEditMode)
            GetRoomEngine().areaSelectionManager.setHighlight(rootX, rootY, width, length);
    }, [rootX, rootY, width, length, batchEditMode]);

    useEffect(() =>
    {
        if (batchEditMode)
        {
            const callback = (x: number, y: number, w: number, h: number) =>
            {
                setRootX(x); setRootY(y); setWidth(w); setLength(h);
                updateSelectedFurnisFromArea(x, y, w, h);
            };
            if (GetRoomEngine().areaSelectionManager.activate(callback, RoomAreaSelectionManager.HIGHLIGHT_DARKEN))
                GetRoomEngine().areaSelectionManager.setHighlight(rootX, rootY, width, length);

            return () => { GetRoomEngine().areaSelectionManager.deactivate(); };
        } else
        {
            GetRoomEngine().areaSelectionManager.deactivate();
            GetRoomEngine().areaSelectionManager.clearHighlight();
            setRootX(0); setRootY(0); setWidth(0); setLength(0);
            setSelectedFurnis([]);
        }
    }, [batchEditMode]);

    useMessageEvent<GetFurniFixToolFurniDataEvent>(GetFurniFixToolFurniDataEvent, event =>
    {
        const parser = event.getParser();


        const newData = {
            id: parser.id,
            spriteId: parser.spriteId,
            publicName: parser.publicName,
            itemName: parser.itemName,
            width: parser.width,
            length: parser.length,
            stackHeight: parser.stackHeight,
            canStack: parser.canStack,
            canSit: parser.canSit,
            isWalkable: parser.isWalkable,
            allowGift: parser.allowGift,
            allowTrade: parser.allowTrade,
            allowRecycle: parser.allowRecycle,
            allowMarketplaceSell: parser.allowMarketplaceSell,
            interactionType: parser.interactionType,
            interactionModesCount: parser.interactionModesCount,
            vendingIds: parser.vendingIds,
            variableHeights: parser.variableHeights,
            pageId: parser.pageId,
            catalogName: parser.catalogName,
            costCredits: parser.costCredits,
            costPixels: parser.costPixels,
            costDiamonds: parser.costDiamonds,
            amount: parser.amount,
            orderNum: parser.orderNum,
            flatId: parser.flatId,
            shouldUpdateCatalog: 0
        };
        setFurniData(newData);
        const initialCatalogData: any = {};
        catalogFields.forEach(field => initialCatalogData[field] = newData[field]);
        setCatalogSnapshot(initialCatalogData);
        setCatalogEdited(false);
    });

    useMessageEvent<FurniFixToolBatchSaveResponseEvent>(FurniFixToolBatchSaveResponseEvent, event =>
    {
        const parser = event.getParser();
        if (parser.success)
        {
            setBatchEditMode(false); setSelectedFurnis([]); setSelectedProperties(new Set());
            setBatchData({}); setIsAreaSelectionMode(false); setCatalogEdited(false);
            setRootX(0); setRootY(0); setWidth(0); setLength(0);
            GetRoomEngine().areaSelectionManager.clearHighlight();
        } else { alert(`Error: ${parser.message}`); }
    });

    useEffect(() =>
    {
        if (!showCatalogOptions)
        {
            // ❌ quitamos esto:
            // setFurniData(prev => ({ ...prev, shouldUpdateCatalog: catalogEdited ? 1 : 0, ...(catalogEdited ? {} : catalogSnapshot) }));
            // setCatalogEdited(false);
        }
    }, [showCatalogOptions, catalogEdited, catalogSnapshot]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        const { name, value } = e.target;
        let parsedValue;
        if (numericFields.has(name))
        {
            parsedValue = value === '' ? 0 : Number(value);
        } else if (stringFields.has(name))
        {
            parsedValue = value;
        } else
        {
            parsedValue = value;
        }
        if (catalogFields.has(name)) setCatalogEdited(true);
        setFurniData(prev => ({ ...prev, [name]: parsedValue }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        const { name, checked } = e.target;
        setFurniData(prev => ({ ...prev, [name]: checked ? 1 : 0 }));
    };

    const handleToggleCatalog = () =>
    {
        const willShow = !showCatalogOptions;
        if (willShow)
        {
            const newSnapshot: any = {};
            catalogFields.forEach(field => newSnapshot[field] = furniData[field]);
            setCatalogSnapshot(newSnapshot);
            setFurniData(prev => ({ ...prev, shouldUpdateCatalog: 1 })); // 👈 queda fijo en 1
        }
        setShowCatalogOptions(willShow);
    };


    const updateSelectedFurnisFromArea = (x: number, y: number, w: number, h: number) =>
    {
        if (w > 0 && h > 0)
        {
            const furnis = getFurnisInArea(x, y, w, h);
            setSelectedFurnis(furnis);
        }
    };

    const startAreaSelection = () => { GetRoomEngine().areaSelectionManager.startSelecting(); };

    const clearAreaSelection = () =>
    {
        setRootX(0); setRootY(0); setWidth(0); setLength(0);
        setSelectedFurnis([]);
        GetRoomEngine().areaSelectionManager.clearHighlight();
    };

    const getFurnisInArea = (rootX: number, rootY: number, width: number, height: number) =>
    {
        const roomEngine = GetNitroInstance().roomEngine;
        const roomId = roomEngine.activeRoomId;
        const floorItems = roomEngine.getRoomObjects(roomId, 20);
        const wallItems = roomEngine.getRoomObjects(roomId, 10);
        const allItems = [...floorItems, ...wallItems];
        const selectedItems: any[] = [];
        allItems.forEach(item =>
        {
            const location = item.getLocation();
            const itemX = Math.floor(location.x);
            const itemY = Math.floor(location.y);
            if (itemX >= rootX && itemX < rootX + width && itemY >= rootY && itemY < rootY + height)
            {
                selectedItems.push({ id: item.id, x: itemX, y: itemY, type: item.type });
            }
        });
        return selectedItems;
    };

    const handlePropertySelection = (property: string) =>
    {
        const newSelected = new Set(selectedProperties);
        if (newSelected.has(property))
        {
            newSelected.delete(property);
            setBatchData(prev =>
            {
                const newData = { ...prev };
                delete newData[property];
                return newData;
            });
        } else
        {
            newSelected.add(property);
            const checkboxFields = ['canStack', 'canSit', 'isWalkable', 'allowGift', 'allowTrade', 'allowRecycle', 'allowMarketplaceSell'];
            if (checkboxFields.includes(property))
            {
                setBatchData(prev => ({ ...prev, [property]: 0 }));
            }
        }
        setSelectedProperties(newSelected);
    };

    const handleBatchInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        const { name, value } = e.target;
        let parsedValue;
        if (numericFields.has(name))
        {
            parsedValue = value === '' ? 0 : Number(value);
        } else if (stringFields.has(name))
        {
            parsedValue = value;
        } else
        {
            parsedValue = value;
        }
        setBatchData(prev => ({ ...prev, [name]: parsedValue }));
    };

    const handleBatchCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        const { name, checked } = e.target;
        const value = checked ? 1 : 0;
        setBatchData(prev => ({ ...prev, [name]: value }));
    };

    const handleBatchSave = () =>
    {
        if (selectedFurnis.length === 0 || selectedProperties.size === 0) return;
        const batchDataToSend = {
            furniIds: selectedFurnis.map(f => f.id),
            properties: Object.fromEntries(
                Array.from(selectedProperties)
                    .filter(prop => batchData[prop] !== undefined)
                    .map(prop => [prop, batchData[prop]])
            ),
            shouldUpdateCatalog: catalogEdited ? 1 : 0
        };
        SendMessageComposer(new FurniFixToolBatchSaveMessageComposer(batchDataToSend));
    };

    const handleSave = () => {
    const dataToSend = { ...furniData, shouldUpdateCatalog: showCatalogOptions ? 1 : 0 };

    if (!showCatalogOptions) {
        // si no está abierto, quitamos los campos de catálogo
        catalogFields.forEach(field => delete dataToSend[field]);
    }

    SendMessageComposer(new FurniFixToolSaveMessageComposer(dataToSend));
    setCatalogEdited(false);
};

    if (!isMod) return null;
    const showMessage = !furniData.id || furniData.id === 0 || furniData.id === -1;

    return (
        <NitroCardView className="nitro-mod-tools-tickets furnifix-tool" style={{ maxWidth: '950px', height: '750px' }}>
            <NitroCardHeaderView headerText="FurniFix Tool" onCloseClick={onCloseClick} />
            <div className="furni-edit-form">
                <div className="batch-controls" style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                    <button onClick={() => setBatchEditMode(!batchEditMode)} style={{ padding: '8px 16px', backgroundColor: batchEditMode ? '#dc3545' : '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        {batchEditMode ? 'Salir de Edición en Lote' : 'Activar Edición en Lote'}
                    </button>
                    {batchEditMode && (
                        <>
                            <button onClick={startAreaSelection} style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Seleccionar Área</button>
                            <button onClick={clearAreaSelection} style={{ padding: '8px 16px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Limpiar Área</button>
                            {selectedFurnis.length > 0 && (<span style={{ color: '#28a745', fontWeight: 'bold', padding: '8px 12px', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #dee2e6' }}>{selectedFurnis.length} furni(s) seleccionado(s)</span>)}
                        </>
                    )}
                </div>
                {batchEditMode ? (
                    <div className="form-container batch-edit-mode">
                        <div className="block">
                            <h3>Información Básica</h3>
                            {['publicName', 'itemName'].map(field => (
                                <div className="input-group" key={field}>
                                    <label className="checkbox-label">
                                        <input type="checkbox" checked={selectedProperties.has(field)} onChange={() => handlePropertySelection(field)} />
                                        <span>{field === 'publicName' ? 'Public Name' : 'Item Name'}</span>
                                    </label>
                                    {selectedProperties.has(field) && (
                                        <input type="text" name={field} value={batchData[field] || ''} onChange={handleBatchInputChange} />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="block">
                            <h3>Dimensiones</h3>
                            {['width', 'length', 'stackHeight'].map(field => (
                                <div className="input-group" key={field}>
                                    <label className="checkbox-label">
                                        <input type="checkbox" checked={selectedProperties.has(field)} onChange={() => handlePropertySelection(field)} />
                                        <span>{field === 'stackHeight' ? 'Stack Height' : field.charAt(0).toUpperCase() + field.slice(1)}</span>
                                    </label>
                                    {selectedProperties.has(field) && (
                                        <input type="number" name={field} value={batchData[field] ?? 0} onChange={handleBatchInputChange} />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="block">
                            <h3>Opciones de Interacción</h3>
                            {['canStack', 'canSit', 'isWalkable', 'allowGift', 'allowTrade', 'allowRecycle', 'allowMarketplaceSell'].map(field => (
                                <div className="input-group" key={field}>
                                    <label className="checkbox-label">
                                        <input type="checkbox" checked={selectedProperties.has(field)} onChange={() => handlePropertySelection(field)} />
                                        <span>
                                            {field === 'canStack' && 'Allow Stack'}
                                            {field === 'canSit' && 'Allow Sit'}
                                            {field === 'isWalkable' && 'Allow Walk'}
                                            {field === 'allowGift' && 'Allow Gift'}
                                            {field === 'allowTrade' && 'Allow Trade'}
                                            {field === 'allowRecycle' && 'Allow Recycle'}
                                            {field === 'allowMarketplaceSell' && 'Allow Marketplace Sell'}
                                        </span>
                                    </label>
                                    {selectedProperties.has(field) && (
                                        <input type="checkbox" name={field} checked={batchData[field] === 1} onChange={handleBatchCheckboxChange} />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="block">
                            <h3>Otros Datos</h3>
                            {['interactionType', 'vendingIds', 'variableHeights', 'interactionModesCount'].map(field => (
                                <div className="input-group" key={field}>
                                    <label className="checkbox-label">
                                        <input type="checkbox" checked={selectedProperties.has(field)} onChange={() => handlePropertySelection(field)} />
                                        <span>
                                            {field === 'variableHeights' && 'Multi Height'}
                                            {field === 'interactionModesCount' && 'Interaction Modes Count'}

                                            {!['variableHeights', 'interactionModesCount'].includes(field) && field}
                                        </span>
                                    </label>
                                    {selectedProperties.has(field) && (
                                        <input
                                            type={field === 'interactionModesCount' ? 'number' : 'text'}
                                            name={field}
                                            value={batchData[field] ?? (field === 'interactionModesCount' ? 0 : '')}
                                            onChange={handleBatchInputChange}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="block" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
                            <button className="save-button" onClick={handleBatchSave} disabled={selectedProperties.size === 0}>
                                Aplicar Cambios a {selectedFurnis.length} Furnis
                            </button>
                            <button className="cancel-button" onClick={() => setBatchEditMode(false)} style={{ marginLeft: '10px' }}>Cancelar</button>
                        </div>
                    </div>
                ) : showMessage ? (
                    <div className="info-message">¡Da click en un furni para empezar o usa "Seleccionar Área" para editar múltiples furnis!</div>
                ) : (
                    <div className="form-container">
                        <div className="block">
                            <img src={String(GetConfiguration("furni.asset.icon.url")).replace("%libname%%param%", furniData.itemName)} alt="Icono" />
                            <h3>Información Básica</h3>
                            <div className="input-group">
                                <label>Public Name</label>
                                <input type="text" name="publicName" value={furniData.publicName || ''} onChange={handleInputChange} />
                            </div>
                            <div className="input-group">
                                <label>Item Name</label>
                                <input type="text" name="itemName" value={furniData.itemName || ''} onChange={handleInputChange} />
                            </div>
                        </div>
                        <div className="block">
                            <h3>Dimensiones</h3>
                            <div className="input-group"><label>Width</label><input type="number" name="width" value={furniData.width ?? 0} onChange={handleInputChange} /></div>
                            <div className="input-group"><label>Length</label><input type="number" name="length" value={furniData.length ?? 0} onChange={handleInputChange} /></div>
                            <div className="input-group"><label>Stack Height</label><input type="number" name="stackHeight" value={furniData.stackHeight ?? 0} onChange={handleInputChange} /></div>
                        </div>
                        <div className="block">
                            <h3>Opciones de Interacción</h3>
                            {['canStack', 'canSit', 'isWalkable', 'allowGift', 'allowTrade', 'allowRecycle', 'allowMarketplaceSell'].map(field => (
                                <div className="input-group" key={field}>
                                    <label className="checkbox-label">
                                        <input type="checkbox" name={field} checked={furniData[field] === 1} onChange={handleCheckboxChange} />
                                        <span>
                                            {field === 'canStack' && 'Allow Stack'}
                                            {field === 'canSit' && 'Allow Sit'}
                                            {field === 'isWalkable' && 'Allow Walk'}
                                            {field === 'allowGift' && 'Allow Gift'}
                                            {field === 'allowTrade' && 'Allow Trade'}
                                            {field === 'allowRecycle' && 'Allow Recycle'}
                                            {field === 'allowMarketplaceSell' && 'Allow Marketplace Sell'}
                                        </span>
                                    </label>
                                </div>
                            ))}
                        </div>
                        <div className="block">
                            <h3>Otros Datos</h3>
                            {['interactionType', 'vendingIds', 'variableHeights'].map(field => (
                                <div className="input-group" key={field}>
                                    <label>{field === 'variableHeights' ? 'Multi Height' : field}</label>
                                    <input type="text" name={field} value={furniData[field] || ''} onChange={handleInputChange} />
                                </div>
                            ))}
                            {['interactionModesCount'].map(field => (
                                <div className="input-group" key={field}>
                                    <label>
                                        {field === 'interactionModesCount' && 'Interaction Modes Count'}
                                    </label>
                                    <input
                                        type={field === 'interactionModesCount' ? 'number' : 'text'}
                                        name={field}
                                        value={furniData[field] ?? (field === 'interactionModesCount' ? 0 : '')}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            ))}
                        </div>
                        <button className="toggle-catalog-button" onClick={handleToggleCatalog}>
                            {showCatalogOptions ? 'Ocultar Opciones de Catálogo' : 'Mostrar Opciones de Catálogo'}
                        </button>
                        {showCatalogOptions && (
                            <div className="block">
                                <h3>Opciones Catálogo</h3>
                                {Array.from(catalogFields).map(field => (
                                    <div className="input-group" key={field}>
                                        <label>
                                            {field === 'orderNum' && 'Order Number'}
                                            {field === 'flatId' && 'Offer ID'}
                                            {field === 'costPixels' && 'Cost Pixels'}
                                            {field === 'costDiamonds' && 'Cost Diamonds'}
                                            {field !== 'orderNum' && field !== 'flatId' && field !== 'costPixels' && field !== 'costDiamonds' && field}
                                        </label>
                                        <input
                                            type={numericFields.has(field) ? 'number' : 'text'}
                                            name={field}
                                            value={furniData[field] ?? (numericFields.has(field) ? 0 : '')}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                        <button className="save-button" onClick={handleSave}>Guardar Cambios</button>
                    </div>
                )}
            </div>
        </NitroCardView>
    );
};
