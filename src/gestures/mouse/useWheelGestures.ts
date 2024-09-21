import { useCallback, useRef } from 'react';

import logger from 'utils/logger';

import { isScroll, isZoom } from './detectors';

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

    if (isZoom(event)) {
      if (event.deltaY < 0) {
        gestures.current.zoom(SCALE_FACTOR_DELTA);
      }
      if (event.deltaY > 0) {
        gestures.current.zoom(-SCALE_FACTOR_DELTA);
      }
    }
    if (isScroll(event)) {
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
