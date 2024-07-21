import { useCallback, useRef } from 'react';

import logger from 'utils/logger';

type WheelGestures = {
  zoom: (scaleFactor: number) => void;
  scroll: (deltaX: number, deltaY: number) => void;
};

const useWheelGestures = (currentScaleFactor: number) => {
  const gestures = useRef<WheelGestures>();

  const handleWheel = useCallback((event: WheelEvent) => {
    if (!gestures.current) {
      logger.error('useWheelGestures - no gestures attached.', null);
      return;
    }

    if (event.ctrlKey) {
      const zoomFactor = currentScaleFactor >= 1 ? 0.1 : 0.05;

      if (event.deltaY < 0) {
        gestures.current.zoom(currentScaleFactor + zoomFactor);
      }
      if (event.deltaY > 0) {
        gestures.current.zoom(currentScaleFactor - zoomFactor);
      }
    } else {
      gestures.current.scroll(event.deltaX, event.deltaY);
    }
  }, [currentScaleFactor]);

  return {
    attach: (wheelGestures: WheelGestures) => {
      gestures.current = wheelGestures;
    },
    next: (event: WheelEvent) => {
      handleWheel(event);
    },
  };
};

export default useWheelGestures;
