import { ColorConverter, GetTicker, IRoomRenderingCanvas, RoomPreviewer, TextureUtils } from '@nitrots/nitro-renderer';
import { FC, MouseEvent, ReactNode, useEffect, useRef, useState } from 'react';

export interface LayoutRoomPreviewerViewProps
{
    roomPreviewer: RoomPreviewer;
    height?: number;
    children?: ReactNode;
    isMonitorWired?: boolean;
}

export const LayoutRoomPreviewerView: FC<LayoutRoomPreviewerViewProps> = props =>
{
    const { roomPreviewer = null, height = 0, children = null, isMonitorWired = false } = props;
    const [ renderingCanvas, setRenderingCanvas ] = useState<IRoomRenderingCanvas>(null);
    const elementRef = useRef<HTMLDivElement>();
    const [ renderingCanvas2, setRenderingCanvas2 ] = useState<IRoomRenderingCanvas>(null);
    const elementRef2 = useRef<HTMLDivElement>();
    const lastUpdate1 = useRef(0);
    const lastUpdate2 = useRef(0);

    const onClick = (event: MouseEvent<HTMLDivElement>) =>
    {
        if(!roomPreviewer) return;

        if(event.shiftKey) roomPreviewer.changeRoomObjectDirection();
        else roomPreviewer.changeRoomObjectState();
    }

    useEffect(() =>
    {
        if(isMonitorWired || !roomPreviewer) return;

        const update = (time: number) =>
        {
            const now = performance.now();
            if (now - lastUpdate1.current < 100) return;
            lastUpdate1.current = now;

            if(!roomPreviewer || !renderingCanvas || !elementRef.current) return;
        
            roomPreviewer.updatePreviewRoomView();

            if(!renderingCanvas.canvasUpdated) return;

            elementRef.current.style.backgroundImage = `url(${ TextureUtils.generateImageUrl(renderingCanvas.master) })`;
        }

        if(!renderingCanvas)
        {
            if(elementRef.current && roomPreviewer)
            {
                const computed = document.defaultView.getComputedStyle(elementRef.current, null);

                let backgroundColor = computed.backgroundColor;

                if (!backgroundColor || !/^rgb\(\d+,\s*\d+,\s*\d+\)$/.test(backgroundColor)) backgroundColor = 'rgb(255, 255, 255)';

                backgroundColor = ColorConverter.rgbStringToHex(backgroundColor);
                backgroundColor = backgroundColor.replace('#', '0x');

                roomPreviewer.backgroundColor = parseInt(backgroundColor, 16);

                const width = elementRef.current.parentElement.clientWidth;
                
                roomPreviewer.getRoomCanvas(width, height);

                const canvas = roomPreviewer.getRenderingCanvas();

                setRenderingCanvas(canvas);

                canvas.canvasUpdated = true;

                update(-1);
            }
        }

        GetTicker().add(update);

        const resizeObserver = new ResizeObserver(() =>
        {
            if(!roomPreviewer || !elementRef.current) return;

            const width = elementRef.current.parentElement.offsetWidth;

            roomPreviewer.modifyRoomCanvas(width, height);

            update(-1);
        });
        
        resizeObserver.observe(elementRef.current);

        return () =>
        {
            resizeObserver.disconnect();

            GetTicker().remove(update);
        }

    }, [ renderingCanvas, roomPreviewer, elementRef, height, isMonitorWired ]);

    useEffect(() =>
    {
        if(!isMonitorWired || !roomPreviewer) return;

        const update = (time: number) =>
        {
            const now = performance.now();
            if (now - lastUpdate2.current < 100) return;
            lastUpdate2.current = now;

            if(!roomPreviewer || !renderingCanvas2 || !elementRef2.current) return;
        
            roomPreviewer.updatePreviewRoomView();

            if(!renderingCanvas2.canvasUpdated) return;

            elementRef2.current.style.backgroundImage = `url(${ TextureUtils.generateImageUrl(renderingCanvas2.master) })`;
        }

        if(!renderingCanvas2)
        {
            if(elementRef2.current && roomPreviewer)
            {
                const computed = document.defaultView.getComputedStyle(elementRef2.current, null);

                let backgroundColor = computed.backgroundColor;

                if (!backgroundColor || !/^rgb\(\d+,\s*\d+,\s*\d+\)$/.test(backgroundColor)) backgroundColor = 'rgb(255, 255, 255)';

                backgroundColor = ColorConverter.rgbStringToHex(backgroundColor);
                backgroundColor = backgroundColor.replace('#', '0x');

                roomPreviewer.backgroundColor = parseInt(backgroundColor, 16);

                const width = elementRef2.current.parentElement.clientWidth;
                
                roomPreviewer.getRoomCanvas(width, height);

                const canvas = roomPreviewer.getRenderingCanvas();

                setRenderingCanvas2(canvas);

                canvas.canvasUpdated = true;

                update(-1);
            }
        }

        GetTicker().add(update);

        const resizeObserver = new ResizeObserver(() =>
        {
            if(!roomPreviewer || !elementRef2.current) return;

            const width = elementRef2.current.parentElement.offsetWidth;

            roomPreviewer.modifyRoomCanvas(width, height);

            update(-1);
        });
        
        if(elementRef2.current) resizeObserver.observe(elementRef2.current);

        return () =>
        {
            resizeObserver.disconnect();

            GetTicker().remove(update);
        }

    }, [ renderingCanvas2, roomPreviewer, elementRef2, height, isMonitorWired ]);

    return isMonitorWired ? (
        <div  className="room-preview-container-wm">
            <div ref={ elementRef2 }  className="room-preview-image-wm" style={ { height } } onClick={ onClick } />
            { children }
        </div>
    ) : (
        <div className="room-preview-container">
            <div ref={ elementRef } className="room-preview-image" style={ { height } } onClick={ onClick } />
            { children }
        </div>
    );
}
