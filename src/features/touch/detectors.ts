import { TTouchEvent } from './useTouchEvents';
import { calcFingersDistance } from './utils';

const { abs } = Math;

const PINCH_OR_PAN_EPSILON = 3; // px

export const isPan = (touch: TTouchEvent, prevTouch: TTouchEvent) => {
  const prevDistance = calcFingersDistance(prevTouch);
  const distance = calcFingersDistance(touch);
  return abs(distance - prevDistance) < PINCH_OR_PAN_EPSILON;
};

export const isPinch = (touch: TTouchEvent, prevTouch: TTouchEvent) => {
  const prevDistance = calcFingersDistance(prevTouch);
  const distance = calcFingersDistance(touch);
  return abs(distance - prevDistance) >= PINCH_OR_PAN_EPSILON;
};
