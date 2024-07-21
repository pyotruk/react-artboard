import { useCallback } from 'react';
import { TMouseEvent } from 'features/mouse/useMouseEvents';
import { TTouchEvent } from 'features/touch/useTouchEvents';

import { Point } from 'utils/types';
import { scaleValue } from 'utils/range';

const artboardSize = {
  width: 400,
  height: 400,
};

const useArtboard = () => {
  const getPos = useCallback((
    event: TMouseEvent | TTouchEvent,
    drawingCanvas: HTMLCanvasElement,
  ): Point => {
    const screenRect = drawingCanvas.getBoundingClientRect();
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
  }, []);

  return {
    artboardSize,
    getPos,
  };
};

export default useArtboard;
