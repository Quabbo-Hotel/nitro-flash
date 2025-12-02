import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { GetConfiguration } from '../../api';
import { FpsCounterEvent } from '../../events';
import { useUiEvent } from '../../hooks';

const SAMPLE_WINDOW_MS = 750;

export const FpsCounter: FC = () =>
{
    const defaultVisibility = useMemo(() =>
    {
        try
        {
            return GetConfiguration<boolean>('ui.debug.show_fps_counter', false);
        }
        catch
        {
            return false;
        }
    }, []);
    const [ isVisible, setIsVisible ] = useState(defaultVisibility);
    const [ fps, setFps ] = useState(0);
    const rafRef = useRef<number>();
    const frameCountRef = useRef(0);
    const lastSampleRef = useRef(performance.now());

    useUiEvent<FpsCounterEvent>(FpsCounterEvent.TOGGLE, event =>
    {
        if((event.visible === undefined) || (event.visible === null)) setIsVisible(prevValue => !prevValue);
        else setIsVisible(!!event.visible);
    });

    useEffect(() =>
    {
        if(!isVisible) return;

        const update = (timestamp: number) =>
        {
            frameCountRef.current++;

            const elapsed = (timestamp - lastSampleRef.current);

            if(elapsed >= SAMPLE_WINDOW_MS)
            {
                const newFps = Math.round((frameCountRef.current * 1000) / elapsed);
                setFps(newFps);
                frameCountRef.current = 0;
                lastSampleRef.current = timestamp;
            }

            rafRef.current = requestAnimationFrame(update);
        };

        rafRef.current = requestAnimationFrame(update);

        return () =>
        {
            if(rafRef.current) cancelAnimationFrame(rafRef.current);
        }
    }, [ isVisible ]);

    if(!isVisible) return null;

    return (
        <div className="fps-counter" onClick={() => setIsVisible(false)}>
            <span>{ fps } FPS</span>
        </div>
    );
};
