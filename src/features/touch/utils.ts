import { Point } from 'utils/types';

import { TTouchEvent } from './useTouchEvents';

const { hypot } = Math;

export const calcFingersDistance = (event: TTouchEvent): number => hypot(
  event.touches[0].clientX - event.touches[1].clientX,
  event.touches[0].clientY - event.touches[1].clientY,
);

export const calcFingersMidpoint = (event: TTouchEvent): Point => ({
  x: (event.touches[0].clientX + event.touches[1].clientX) / 2,
  y: (event.touches[0].clientY + event.touches[1].clientY) / 2,
});
