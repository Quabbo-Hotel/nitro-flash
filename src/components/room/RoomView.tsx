import { RoomZoomEvent } from '@nitrots/nitro-renderer';
import { FC, useEffect, useRef } from 'react';
import { DispatchMouseEvent, DispatchTouchEvent, GetNitroInstance, GetRoomEngine, GetSessionDataManager } from '../../api';
import { Base } from '../../common';
import { useRoom } from '../../hooks';
import { RoomSpectatorView } from './spectator/RoomSpectatorView';
import { RoomWidgetsView } from './widgets/RoomWidgetsView';

const MIN_ZOOM_LEVEL = 1;
const MAX_ZOOM_LEVEL = 5;
const ZOOM_STEP = 0.25;

export const RoomView: FC<{}> = props =>
{
    const { roomSession = null } = useRoom();
    const elementRef = useRef<HTMLDivElement>();
    const roomSessionRef = useRef(roomSession);

    useEffect(() =>
    {
        roomSessionRef.current = roomSession;
    }, [ roomSession ]);

    useEffect(() =>
    {
        const canvas = GetNitroInstance().application.renderer.view;

        if(!canvas) return;

        canvas.onclick = event => DispatchMouseEvent(event);
        canvas.onmousemove = event => DispatchMouseEvent(event);
        canvas.onmousedown = event => DispatchMouseEvent(event);
        canvas.onmouseup = event => DispatchMouseEvent(event);

        canvas.ontouchstart = event => DispatchTouchEvent(event);
        canvas.ontouchmove = event => DispatchTouchEvent(event);
        canvas.ontouchend = event => DispatchTouchEvent(event);
        canvas.ontouchcancel = event => DispatchTouchEvent(event);

        const handleWheel = (event: WheelEvent) =>
        {
            const session = roomSessionRef.current;
            const sessionDataManager = GetSessionDataManager();

            if(!session || !sessionDataManager?.isMouseWheelZoomEnabled) return;
            if(event.ctrlKey) return;

            const direction = Math.sign(event.deltaY);

            if(!direction) return;

            const roomEngine = GetRoomEngine();

            if(!roomEngine) return;

            const currentScale = roomEngine.getRoomInstanceRenderingCanvasScale(session.roomId, 1);
            const normalizedScale = (Number.isFinite(currentScale) ? currentScale : 1);
            const targetScale = Math.max(MIN_ZOOM_LEVEL, Math.min(MAX_ZOOM_LEVEL, normalizedScale + (direction < 0 ? ZOOM_STEP : -ZOOM_STEP)));

            if(Math.abs(targetScale - normalizedScale) < 0.001) return;

            event.preventDefault();

            roomEngine.events.dispatchEvent(new RoomZoomEvent(session.roomId, targetScale, false));
        };

        canvas.addEventListener('wheel', handleWheel, { passive: false });

        const element = elementRef.current;

        if(!element) return;

        element.appendChild(canvas);

        return () =>
        {
            canvas.removeEventListener('wheel', handleWheel);
        };
    }, []);

    return (
        <Base fit innerRef={ elementRef } className={ (!roomSession && 'd-none') }>
            { roomSession &&
                <>
                    <RoomWidgetsView />
                    { roomSession.isSpectator && <RoomSpectatorView /> }
                </> }
        </Base>
    );
}
