import { useCallback, useEffect, useRef } from 'react';

import logger from 'utils/logger';

import { TTouchEvent } from '../types';

import useTouchEvents from './useTouchEvents';
import { calcFingersAngle, calcFingersDistance, calcFingersMidpoint } from './utils';
import { isPan, isPinch, isRotate } from './detectors';

const { abs } = Math;

type TouchGestures = {
  pinch: (scaleFactorDelta: number) => void;
  pan: (deltaX: number, deltaY: number) => void;
  rotate: (angleDelta: number) => void;
};

const useTouchGestures = () => {
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
        const scaleFactorDelta = abs(distance - prevDistance);

        if (distance > prevDistance) {
          gestures.current.pinch(scaleFactorDelta);
        }
        if (distance < prevDistance) {
          gestures.current.pinch(-scaleFactorDelta);
        }
      }
      if (isRotate(event, prevTouch.current)) {
        gestures.current.rotate(calcFingersAngle(event) - calcFingersAngle(prevTouch.current));
      }
    }
    prevTouch.current = event;
  }, []);

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
