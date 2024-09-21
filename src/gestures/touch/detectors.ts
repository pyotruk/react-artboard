import { TTouchEvent } from '../types';

import { calcFingersAngle, calcFingersDistance } from './utils';

const { abs } = Math;

const PINCH_OR_PAN_EPSILON = 3; // px
const PAN_OR_ROTATE_FINGERS_DISTANCE = 100; // px
const ROTATE_ANGLE_THRESHOLD = 0.2; // degrees

export const isPan = (touch: TTouchEvent, prevTouch: TTouchEvent): boolean => {
  if (calcFingersDistance(touch) >= PAN_OR_ROTATE_FINGERS_DISTANCE) {
    return false;
  }
  const prevDistance = calcFingersDistance(prevTouch);
  const distance = calcFingersDistance(touch);
  return abs(distance - prevDistance) < PINCH_OR_PAN_EPSILON;
};

export const isPinch = (touch: TTouchEvent, prevTouch: TTouchEvent): boolean => {
  const prevDistance = calcFingersDistance(prevTouch);
  const distance = calcFingersDistance(touch);
  return abs(distance - prevDistance) >= PINCH_OR_PAN_EPSILON;
};

export const isRotate = (touch: TTouchEvent, prevTouch: TTouchEvent): boolean => {
  if (calcFingersDistance(touch) < PAN_OR_ROTATE_FINGERS_DISTANCE) {
    return false;
  }
  return abs(calcFingersAngle(touch) - calcFingersAngle(prevTouch)) >= ROTATE_ANGLE_THRESHOLD;
};
