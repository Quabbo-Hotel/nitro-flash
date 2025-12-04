import { FC, useEffect, useRef, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredSelectorBaseView } from './WiredSelectorBaseView';


const TILE_WIDTH = 18;
const TILE_HEIGHT = 9;
const MAP_WIDTH = 13;
const MAP_HEIGHT = 13;
const MID_X = Math.floor(MAP_WIDTH / 2);
const MID_Y = Math.floor(MAP_HEIGHT / 2);


export const WiredSelectorFurniNeighbor: FC<{}> = () =>
{
    // --- Estados principales
    const [mode, setMode] = useState("paint");
    const [selectedTile, setSelectedTile] = useState({ x: 0, y: 0 });
    const [inputCoords, setInputCoords] = useState({ x: 0, y: 0 });
    const modeRef = useRef(mode);
    const isDrawingRef = useRef(false);
    const [neighborMode, setNeighborMode] = useState(0);
    const { trigger = null, setStringParam = null, setIntParams = null } = useWired();
    const [selectedGroup, setSelectedGroup] = useState<'first' | 'second'>('first');
    const [isShiftPressed, setIsShiftPressed] = useState(false);
    const [selectionStart, setSelectionStart] = useState(null);
    const [selectionEnd, setSelectionEnd] = useState(null);


    // --- Estados para recordar último modo de cada grupo
    const [lastFirstGroupMode, setLastFirstGroupMode] = useState(0);
    const [lastSecondGroupMode, setLastSecondGroupMode] = useState(3);


    const canvasRef = useRef(null);
    const [map, setMap] = useState(() =>
    {
        const initialMap = [];
        for (let x = 0; x < MAP_WIDTH; x++)
        {
            initialMap[x] = [];
            for (let y = 0; y < MAP_HEIGHT; y++)
            {
                initialMap[x][y] = { color: "#161616", borderColor: "#343434" };
            }
        }
        return initialMap;
    });


    useEffect(() =>
    {
        const handleKeyDown = (e) =>
        {
            if (e.key === 'Shift') setIsShiftPressed(true);
        };
        const handleKeyUp = (e) =>
        {
            if (e.key === 'Shift')
            {
                setIsShiftPressed(false);
                setSelectionStart(null);
                setSelectionEnd(null);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        return () =>
        {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, []);


    useEffect(() =>
    {
        if (!trigger) return;
        if (trigger.stringData && trigger.stringData.length > 0)
        {
            const rows = trigger.stringData.split(",");
            setMap(() =>
            {
                const newMap = [];
                for (let x = 0; x < MAP_WIDTH; x++)
                {
                    newMap[x] = [];
                    for (let y = 0; y < MAP_HEIGHT; y++)
                    {
                        const char = rows[y] ? rows[y][x] : "x";
                        newMap[x][y] =
                            char === "o"
                                ? { color: "rgb(0,101,255)", borderColor: "#343434" }
                                : { color: "#161616", borderColor: "#343434" };
                    }
                }
                return newMap;
            });
        }


        if (trigger.intData && trigger.intData.length >= 3)
        {
            const loadedNeighborMode = trigger.intData[0];
            setNeighborMode(loadedNeighborMode);


            // Recordamos última selección para cada grupo
            if ([0, 1, 2].includes(loadedNeighborMode))
            {
                setSelectedGroup('first');
                setLastFirstGroupMode(loadedNeighborMode);
            }
            else if ([3, 4].includes(loadedNeighborMode))
            {
                setSelectedGroup('second');
                setLastSecondGroupMode(loadedNeighborMode);
            }


            const tile = { x: trigger.intData[1], y: trigger.intData[2] };
            setSelectedTile(tile);
            setInputCoords(tile);
        }
    }, [trigger]);


    useEffect(() =>
    {
        modeRef.current = mode;
    }, [mode]);


    useEffect(() =>
    {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");


        canvas.width = 280;
        canvas.height = 135;


        const mapPixelWidth = (MAP_WIDTH + MAP_HEIGHT) * (TILE_WIDTH / 2);
        const mapPixelHeight = (MAP_WIDTH + MAP_HEIGHT) * (TILE_HEIGHT / 2);


        const offsetX = (canvas.width - mapPixelWidth) / 2;
        const offsetY = (canvas.height - mapPixelHeight) / 2;


        const drawTile = (gridX, gridY, color, borderColor) =>
        {
            const x = gridX + MID_X;
            const y = gridY + MID_Y;
            const isoX = (x - y) * (TILE_WIDTH / 2) + offsetX + mapPixelWidth / 2;
            const isoY = (x + y) * (TILE_HEIGHT / 2) + offsetY;


            ctx.fillStyle = borderColor;
            ctx.beginPath();
            ctx.moveTo(isoX, isoY);
            ctx.lineTo(isoX + TILE_WIDTH / 2, isoY + TILE_HEIGHT / 2);
            ctx.lineTo(isoX, isoY + TILE_HEIGHT);
            ctx.lineTo(isoX - TILE_WIDTH / 2, isoY + TILE_HEIGHT / 2);
            ctx.closePath();
            ctx.fill();


            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(isoX, isoY);
            ctx.lineTo(isoX + TILE_WIDTH / 2, isoY + TILE_HEIGHT / 2);
            ctx.lineTo(isoX, isoY + TILE_HEIGHT);
            ctx.lineTo(isoX - TILE_WIDTH / 2, isoY + TILE_HEIGHT / 2);
            ctx.closePath();
            ctx.fill();


            if (selectedTile.x === gridX && selectedTile.y === gridY)
            {
                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(isoX, isoY + 1);
                ctx.lineTo(isoX + TILE_WIDTH / 2 - 1, isoY + TILE_HEIGHT / 2);
                ctx.lineTo(isoX, isoY + TILE_HEIGHT - 1);
                ctx.lineTo(isoX - TILE_WIDTH / 2 + 1, isoY + TILE_HEIGHT / 2);
                ctx.closePath();
                ctx.stroke();
            }
        };


        ctx.clearRect(0, 0, canvas.width, canvas.height);


        for (let x = 0; x < MAP_WIDTH; x++)
            for (let y = 0; y < MAP_HEIGHT; y++)
                drawTile(x - MID_X, y - MID_Y, map[x][y].color, map[x][y].borderColor);


        if (isShiftPressed && selectionStart && selectionEnd)
        {
            const startX = Math.min(selectionStart.x, selectionEnd.x);
            const endX = Math.max(selectionStart.x, selectionEnd.x);
            const startY = Math.min(selectionStart.y, selectionEnd.y);
            const endY = Math.max(selectionStart.y, selectionEnd.y);
            for (let x = startX; x <= endX; x++)
                for (let y = startY; y <= endY; y++)
                    drawTile(x, y, "rgba(212, 24, 212, 0.5)", "#343434");
        }
    }, [map, selectedTile, isShiftPressed, selectionStart, selectionEnd]);


    useEffect(() =>
    {
        const canvas = canvasRef.current;
        if (!canvas) return;


        const getTileAtPosition = (mouseX, mouseY) =>
        {
            const ctx = canvas.getContext("2d");
            const mapPixelWidth = (MAP_WIDTH + MAP_HEIGHT) * (TILE_WIDTH / 2);
            const mapPixelHeight = (MAP_WIDTH + MAP_HEIGHT) * (TILE_HEIGHT / 2);
            const offsetX = (canvas.width - mapPixelWidth) / 2;
            const offsetY = (canvas.height - mapPixelHeight) / 2;


            for (let x = 0; x < MAP_WIDTH; x++)
            {
                for (let y = 0; y < MAP_HEIGHT; y++)
                {
                    const isoX = (x - y) * (TILE_WIDTH / 2) + offsetX + mapPixelWidth / 2;
                    const isoY = (x + y) * (TILE_HEIGHT / 2) + offsetY;


                    const path = new Path2D();
                    path.moveTo(isoX, isoY);
                    path.lineTo(isoX + TILE_WIDTH / 2, isoY + TILE_HEIGHT / 2);
                    path.lineTo(isoX, isoY + TILE_HEIGHT);
                    path.lineTo(isoX - TILE_WIDTH / 2, isoY + TILE_HEIGHT / 2);
                    path.closePath();


                    if (ctx.isPointInPath(path, mouseX, mouseY))
                        return { x: x - MID_X, y: y - MID_Y };
                }
            }
            return null;
        };


        const handleMouseDown = (e) =>
        {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;


            const tile = getTileAtPosition(mouseX, mouseY);
            if (!tile) return;


            if (modeRef.current === "select")
            {
                setSelectedTile(tile);
                setInputCoords(tile);
                return;
            }


            isDrawingRef.current = true;


            if (isShiftPressed)
            {
                setSelectionStart(tile);
                setSelectionEnd(tile);
                return;
            }


            updateTile(tile.x, tile.y);
        };


        const handleMouseMove = (e) =>
        {
            if (!isDrawingRef.current) return;
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const tile = getTileAtPosition(mouseX, mouseY);
            if (!tile) return;
            if (isShiftPressed)
            {
                setSelectionEnd(tile);
                return;
            }
            updateTile(tile.x, tile.y);
        };


        const handleMouseUp = () =>
        {
            if (isShiftPressed && selectionStart && selectionEnd)
            {
                const startX = Math.min(selectionStart.x, selectionEnd.x);
                const endX = Math.max(selectionStart.x, selectionEnd.x);
                const startY = Math.min(selectionStart.y, selectionEnd.y);
                const endY = Math.max(selectionStart.y, selectionEnd.y);


                setMap(prevMap =>
                {
                    const newMap = prevMap.map(row => [...row]);
                    for (let x = startX + MID_X; x <= endX + MID_X; x++)
                    {
                        for (let y = startY + MID_Y; y <= endY + MID_Y; y++)
                        {
                            newMap[x][y] = modeRef.current === "paint"
                                ? { color: "rgb(0,101,255)", borderColor: "#343434" }
                                : { color: "#161616", borderColor: "#343434" };
                        }
                    }
                    return newMap;
                });


                setSelectionStart(null);
                setSelectionEnd(null);
            }


            isDrawingRef.current = false;
        };


        const updateTile = (gridX, gridY) =>
        {
            const x = gridX + MID_X;
            const y = gridY + MID_Y;
            setMap(prevMap =>
            {
                const newMap = prevMap.map(row => [...row]);
                newMap[x][y] = modeRef.current === "paint"
                    ? { color: "rgb(0,101,255)", borderColor: "#343434" }
                    : { color: "#161616", borderColor: "#343434" };
                return newMap;
            });
        };


        canvas.addEventListener("mousedown", handleMouseDown);
        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseup", handleMouseUp);
        canvas.addEventListener("mouseleave", handleMouseUp);


        return () =>
        {
            canvas.removeEventListener("mousedown", handleMouseDown);
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseup", handleMouseUp);
            canvas.removeEventListener("mouseleave", handleMouseUp);
        };
    }, [isShiftPressed, selectionStart, selectionEnd]);


    // --- GUARDAR valores
    const save = () => 
    {
        const selectedCells2D = [];
        for (let y = 0; y < MAP_HEIGHT; y++) 
        {
            const row = [];
            for (let x = 0; x < MAP_WIDTH; x++) 
            {
                const isSelected = map[x][y].color === "rgb(0,101,255)";
                row.push(isSelected ? "o" : "x");
            }
            selectedCells2D.push(row.join(""));
        }
        setStringParam(selectedCells2D.join(","));
        setIntParams([neighborMode, selectedTile.x, selectedTile.y]);
    };


    // --- Cambiar grupo
    const handleGroupChange = (group: 'first' | 'second') =>
    {
        setSelectedGroup(group);
        if(group === 'first')
            setNeighborMode(lastFirstGroupMode);
        else
            setNeighborMode(lastSecondGroupMode);
    };


    // --- Cambiar modo y recordar último usado en ese grupo
    const handleModeChange = (modeValue: number) =>
    {
        setNeighborMode(modeValue);
        if(selectedGroup === 'first') setLastFirstGroupMode(modeValue);
        else setLastSecondGroupMode(modeValue);
    };


    // --- Cambiar coordenadas
    const handleCoordinateChange = (axis, value) =>
    {
        // Permitir borrar o escribir "-" sin romper el input
        if (value === "" || value === "-") {
            setInputCoords(prev => ({ ...prev, [axis]: value }));
            return;
        }

        let numValue = parseInt(value, 10);

        if (isNaN(numValue)) return;

        const clamp = (MAP_HEIGHT % 2 !== 0) 
        ? (MAP_HEIGHT / 2) - 0.5 
        : (MAP_HEIGHT / 2);

            

        if (numValue < -clamp) numValue = -clamp;
        if (numValue > clamp) numValue = clamp;

        const newCoords = { ...inputCoords, [axis]: numValue };
        setInputCoords(newCoords);

        const x = newCoords.x + MID_X;
        const y = newCoords.y + MID_Y;
        if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT)
        {
            setSelectedTile(newCoords);
        }
    };


        // --- RENDER
        return (
                <WiredSelectorBaseView hasSpecialInput={true} requiresFurni={1} save={save}>
            <div >
                <div className='global-neighbor'>
                    <button
                        className='button-add-tile'
                        onClick={() => setMode("paint")}
                        style={mode === "paint" ? { border: "2px solid white", backgroundColor: "#ececec" } : {}}
                    />
                    <button
                        className='button-remove-tile'
                        onClick={() => setMode("erase")}
                        style={mode === "erase" ? { border: "2px solid white", backgroundColor: "#ececec" } : {}}
                    />
                    <div className='divisor-buttons-neighbor' />
                    <button
                        className='button-select-tile'
                        onClick={() => setMode("select")}
                        style={mode === "select" ? { border: "2px solid white", backgroundColor: "#ececec" } : {}}
                    />
                </div>
                <canvas
                    ref={canvasRef}
                    style={{
                        imageRendering: "pixelated",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                    }}
                />


                <div style={{ marginLeft: "20px", display: "flex", gap: "10px", alignItems: "end", justifyContent: "flex-end" }}>
                    <div>
                        <label style={{ color: "black", marginRight: "5px" }}>x:</label>
                        <input
                            type="text"
                            value={inputCoords.x}
                            onChange={e => handleCoordinateChange("x", e.target.value)}
                            style={{
                                width: "40px",
                                borderRadius: "4px",
                                border: "1px solid #ddd"
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ color: "black", marginRight: "5px" }}>y:</label>
                        <input
                            type="text"
                            value={inputCoords.y}
                            onChange={e => handleCoordinateChange("y", e.target.value)}
                            style={{
                                width: "40px",
                                borderRadius: "4px",
                                border: "1px solid #ddd"
                            }}
                        />
                    </div>
                </div>
            </div>
            <hr className="m-0 bg-dark" />
            <Column style={{ display: "flex", alignItems: "flex-start" }} gap={1}>
                <div className='container-button-user-furni'>
                    <Text bold>{LocalizeText('wiredfurni.params.select.neighbor.title')}</Text>
                    <Flex style={{ height: "20px" }}>
                        <button
                            onClick={() => handleGroupChange('first')}
                            style={{
                                border: selectedGroup === 'first' ? '2px solid white' : '2px solid rgb(182, 190, 197)',
                                backgroundColor: selectedGroup === 'first' ? '#ececec' : 'rgb(205, 211, 217)',
                                borderTopLeftRadius: "10px"
                            }}
                        >
                            <div className='icon-furnis-neighbor icon-neighbor-selectfurniuser'></div>
                        </button>
                        <div style={{ width: "5px", height: "1px" }}></div>
                        <button
                            onClick={() => handleGroupChange('second')}
                            style={{
                                border: selectedGroup === 'second' ? '2px solid white' : '2px solid rgb(182, 190, 197)',
                                backgroundColor: selectedGroup === 'second' ? '#ececec' : 'rgb(205, 211, 217)',
                                borderBottomRightRadius: "10px",
                            }}
                        >
                            <div className='icon-users-neighbor icon-neighbor-selectfurniuser'></div>
                        </button>
                    </Flex>
                </div>
                <Flex alignItems="center" gap={1} justifyContent='center' alignSelf='center'>
                    {(selectedGroup === 'first' ? [0, 1, 2] : [3, 4]).map(modeValue => (
                        <button
                            key={modeValue}
                            className={`button-icons-selector-general icon-neighbor-${modeValue}`}
                            onClick={() => handleModeChange(modeValue)}
                            style={{
                                backgroundColor: neighborMode === modeValue ? 'rgb(236, 236, 236)' : '#cdd3d9',
                                border: neighborMode === modeValue ? '2px solid white' : '2px solid #b6bec5',
                            }}
                        />
                    ))}
                </Flex>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
                    <Text bold>
                        {LocalizeText(`wiredfurni.params.textmode.neighbor.${neighborMode}`)}
                    </Text>
                </div>
            </Column>
        </WiredSelectorBaseView>
    );
};
