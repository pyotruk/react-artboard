import { useCallback, useEffect, useRef, useState } from 'react';
import ZoomControls from 'features/zoom/ZoomControls';
import Artboard from 'features/artboard/Artboard';
import useMouseEvents, { TMouseEvent } from 'features/mouse/useMouseEvents';
import useTouchEvents, { TTouchEvent } from 'features/touch/useTouchEvents';
import useDrawing from 'features/drawing/useDrawing';
import useArtboard from 'features/artboard/useArtboard';

import styles from './styles';

function App() {
  const classes = styles();

  const { artboardSize, getPos } = useArtboard();
  const [scaleFactor, setScaleFactor] = useState<number>(1);

  const drawingCanvas = useRef<null | HTMLCanvasElement>(null);
  const { beginBrush, continueBrush, endBrush } = useDrawing();

  const mouseEvents = useMouseEvents();
  const touchEvents = useTouchEvents();

  const down = useCallback((event: TMouseEvent | TTouchEvent) => {
    const { x, y } = getPos(event, drawingCanvas.current!);
    beginBrush(x, y, drawingCanvas.current!.getContext('2d')!);
  }, [getPos, beginBrush]);

  const move = useCallback((event: TMouseEvent | TTouchEvent) => {
    const { x, y } = getPos(event, drawingCanvas.current!);
    continueBrush(x, y, drawingCanvas.current!.getContext('2d')!);
  }, [getPos, continueBrush]);

  const up = useCallback((event: TMouseEvent | TTouchEvent) => {
    const { x, y } = getPos(event, drawingCanvas.current!);
    endBrush(x, y, drawingCanvas.current!.getContext('2d')!);
  }, [getPos, endBrush]);

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
        <Artboard
          scaleFactor={scaleFactor}
          onZoom={setScaleFactor}
        >
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
        <ZoomControls
          scaleFactor={scaleFactor}
          onZoom={setScaleFactor}
        />
      </div>
    </div>
  );
}

export default App;
