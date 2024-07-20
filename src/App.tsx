import { useCallback, useEffect, useRef } from 'react';
import ZoomControls from 'features/zoom/ZoomControls';
import Artboard from 'features/layer/artboard/Artboard';
import useMouseEvents, { TMouseEvent } from 'shared/hooks/useMouseEvents';
import useTouchEvents, { TTouchEvent } from 'shared/hooks/useTouchEvents';

import styles from './styles';
import useArtboard from './features/layer/artboard/useArtboard';

function App() {
  const classes = styles();

  const { artboardSize, getPos } = useArtboard();

  const drawingCanvas = useRef<null | HTMLCanvasElement>(null);

  const mouseEvents = useMouseEvents();
  const touchEvents = useTouchEvents();

  const down = useCallback((event: TMouseEvent | TTouchEvent) => {
    const { x, y } = getPos(event, drawingCanvas.current!);
    const ctx = drawingCanvas.current!.getContext('2d')!;
    ctx.strokeStyle = 'lightblue';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
  }, [getPos]);

  const move = useCallback((event: TMouseEvent | TTouchEvent) => {
    const { x, y } = getPos(event, drawingCanvas.current!);
    const ctx = drawingCanvas.current!.getContext('2d')!;
    ctx.lineTo(x, y);
    ctx.stroke();
  }, [getPos]);

  const up = useCallback((event: TMouseEvent | TTouchEvent) => {
    const { x, y } = getPos(event, drawingCanvas.current!);
    const ctx = drawingCanvas.current!.getContext('2d')!;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.closePath();
  }, [getPos]);

  useEffect(() => {
    mouseEvents.attach({
      start: down,
      move,
      end: e => {
        e.stopPropagation();
        up(e);
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
              backgroundImage: 'url("https://picsum.photos/200/300")',
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
