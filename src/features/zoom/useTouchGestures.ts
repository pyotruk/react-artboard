import { useCallback, useEffect, useRef } from 'react';
import useTouchEvents, { TTouchEvent } from 'shared/hooks/useTouchEvents';

import { Point } from 'utils/types';
import logger from 'utils/logger';

const { abs, hypot } = Math;

const PINCH_OR_PAN_EPSILON = 3; // px

const calcFingersDistance = (event: TTouchEvent): number => hypot(
  event.touches[0].clientX - event.touches[1].clientX,
  event.touches[0].clientY - event.touches[1].clientY,
);

const calcFingersMidpoint = (event: TTouchEvent): Point => ({
  x: (event.touches[0].clientX + event.touches[1].clientX) / 2,
  y: (event.touches[0].clientY + event.touches[1].clientY) / 2,
});

type TouchGestures = {
  pinch: (scaleFactor: number) => void;
  pan: (deltaX: number, deltaY: number) => void;
};

const useTouchGestures = (currentScaleFactor: number) => {
  const gestures = useRef<TouchGestures>();
  const prevTouch = useRef<null | TTouchEvent>(null);

  const touchEvents = useTouchEvents();

  const onTouchStart = useCallback(() => {
    prevTouch.current = null;
  }, []);

  const onTouchMove = useCallback((event: TTouchEvent) => {
    if (!gestures.current) {
      logger.error('useTouchGestures - no gestures attached.', null);
      return;
    }

    if (prevTouch.current) {
      const prevDistance = calcFingersDistance(prevTouch.current);
      const distance = calcFingersDistance(event);

      if (abs(distance - prevDistance) < PINCH_OR_PAN_EPSILON) {
        const midpoint = calcFingersMidpoint(event);
        const prevMidpoint = calcFingersMidpoint(prevTouch.current);
        gestures.current.pan(prevMidpoint.x - midpoint.x, prevMidpoint.y - midpoint.y);
      } else {
        const zoomIntensity = currentScaleFactor >= 1 ? 100 : 200;
        const zoomFactor = abs(distance - prevDistance) / zoomIntensity;

        if (distance > prevDistance) {
          gestures.current.pinch(currentScaleFactor + zoomFactor);
        }
        if (distance < prevDistance) {
          gestures.current.pinch(currentScaleFactor - zoomFactor);
        }
      }
    }
    prevTouch.current = event;
  }, [currentScaleFactor]);

  useEffect(() => {
    touchEvents.attach('multi', {
      start: onTouchStart,
      move: onTouchMove,
      end: () => {},
    });
  }, [touchEvents, onTouchStart, onTouchMove]);

  return {
    attach: (touchGestures: TouchGestures) => {
      gestures.current = touchGestures;
    },
    next: (event: TTouchEvent) => {
      touchEvents.next(event);
    },
  };
};

export default useTouchGestures;
