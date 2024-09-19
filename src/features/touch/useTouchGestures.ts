import { useCallback, useEffect, useRef } from 'react';

import logger from 'utils/logger';

import useTouchEvents, { TTouchEvent } from './useTouchEvents';
import { calcFingersDistance, calcFingersMidpoint } from './utils';
import { isPan, isPinch } from './detectors';

const { abs } = Math;

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

      if (isPan(event, prevTouch.current)) {
        const midpoint = calcFingersMidpoint(event);
        const prevMidpoint = calcFingersMidpoint(prevTouch.current);
        gestures.current.pan(prevMidpoint.x - midpoint.x, prevMidpoint.y - midpoint.y);
      }
      if (isPinch(event, prevTouch.current)) {
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
