import { useCallback, useRef } from 'react';

import logger from 'utils/logger';

type WheelGestures = {
  zoom: (scaleFactorDelta: number) => void;
  scroll: (deltaX: number, deltaY: number) => void;
};

const SCALE_FACTOR_DELTA = 10;

const useWheelGestures = () => {
  const gestures = useRef<WheelGestures>();

  const handleWheel = useCallback((event: WheelEvent) => {
    if (!gestures.current) {
      logger.error('useWheelGestures - no gestures attached.', null);
      return;
    }

    if (event.ctrlKey) {
      if (event.deltaY < 0) {
        gestures.current.zoom(SCALE_FACTOR_DELTA);
      }
      if (event.deltaY > 0) {
        gestures.current.zoom(-SCALE_FACTOR_DELTA);
      }
    } else {
      gestures.current.scroll(event.deltaX, event.deltaY);
    }
  }, []);

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
