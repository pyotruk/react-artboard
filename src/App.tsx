import { useCallback, useEffect, useRef } from 'react';
import { useAppSelector } from 'shared/redux/hooks';
import ZoomControls from 'features/zoom/ZoomControls';
import Artboard from 'features/layer/artboard/Artboard';
import { getArtboardDataURL, getArtboardSize } from 'features/layer/layerOptionsSlice';
import useMouseEvents, { TMouseEvent } from 'shared/hooks/useMouseEvents';
import useTouchEvents, { TTouchEvent } from 'shared/hooks/useTouchEvents';

import { Point, Size } from 'utils/types';
import { scaleValue } from 'utils/range';

import styles from './styles';

function App() {
  const classes = styles();

  const artboardSize: Size = useAppSelector(getArtboardSize);
  const artboardDataURL: string = useAppSelector(getArtboardDataURL);

  const drawingCanvas = useRef<null | HTMLCanvasElement>(null);

  const mouseEvents = useMouseEvents();
  const touchEvents = useTouchEvents();

  const getPos = useCallback((event: TMouseEvent | TTouchEvent): Point => {
    const screenRect = drawingCanvas.current!.getBoundingClientRect();
    const screenPos = 'touches' in event
      ? {
        x: (event as TouchEvent).touches[0].clientX,
        y: (event as TouchEvent).touches[0].clientY,
      }
      : {
        x: (event as MouseEvent).clientX,
        y: (event as MouseEvent).clientY,
      };
    return {
      x: scaleValue({
        value: screenPos.x - screenRect.left,
        originalRange: [0, screenRect.width],
        targetRange: [0, artboardSize.width],
      }),
      y: scaleValue({
        value: screenPos.y - screenRect.top,
        originalRange: [0, screenRect.height],
        targetRange: [0, artboardSize.height],
      }),
    };
  }, [artboardSize]);

  const down = useCallback((event: TMouseEvent | TTouchEvent) => {
    const { x, y } = getPos(event);
    const ctx = drawingCanvas.current!.getContext('2d')!;
    ctx.strokeStyle = 'lightblue';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(x, y);
  }, [getPos]);

  const move = useCallback((event: TMouseEvent | TTouchEvent) => {
    const { x, y } = getPos(event);
    const ctx = drawingCanvas.current!.getContext('2d')!;
    ctx.lineTo(x, y);
    ctx.stroke();
  }, [getPos]);

  const up = useCallback(() => {
    const ctx = drawingCanvas.current!.getContext('2d')!;
    ctx.closePath();
  }, []);

  useEffect(() => {
    mouseEvents.attach({
      start: down,
      move,
      end: e => {
        e.stopPropagation();
        up();
      },
    });
    touchEvents.attach('single', {
      start: down,
      move,
      end: up,
    });
  }, [mouseEvents, touchEvents, down, move, up]);

  useEffect(() => {
    const mouseup = (e: MouseEvent) => mouseEvents.next(e);
    window.addEventListener('mouseup', mouseup);

    const touchend = (e: TouchEvent) => touchEvents.next(e);
    window.addEventListener('touchend', touchend);

    return () => {
      window.removeEventListener('mouseup', mouseup);
      window.removeEventListener('touchend', touchend);
    };
  }, [mouseEvents, touchEvents]);

  return (
    <div className={classes.viewWrapper}>
      <div
        className={classes.view}
        onMouseMove={e => mouseEvents.next(e)}
        onTouchMove={e => touchEvents.next(e)}
      >
        <Artboard>
          <canvas
            ref={ref => {
              if (!ref) return;
              drawingCanvas.current = ref;
              drawingCanvas.current.width = artboardSize.width;
              drawingCanvas.current.height = artboardSize.height;
            }}
            onMouseDown={e => mouseEvents.next(e)}
            onTouchStart={e => touchEvents.next(e)}
            className={classes.drawingCanvas}
            style={{
              backgroundImage: `url(${artboardDataURL})`,
              ...artboardSize,
            }}
          />
        </Artboard>
        <ZoomControls />
      </div>
    </div>
  );
}

export default App;
