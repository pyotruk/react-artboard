import { Touch } from 'react';

import { Point, TTouchEvent } from '../types';

const { hypot, atan2, PI } = Math;

const radiansToDegrees = (radians: number): number => radians * 180 / PI;

const calcPointAngle = (point: Point, center: Point): number => radiansToDegrees(atan2(
  point.y - center.y,
  point.x - center.x,
));

const touchToPoint = (touch: Touch): Point => ({ x: touch.clientX, y: touch.clientY });

export const calcFingersDistance = (event: TTouchEvent): number => hypot(
  event.touches[0].clientX - event.touches[1].clientX,
  event.touches[0].clientY - event.touches[1].clientY,
);

export const calcFingersMidpoint = (event: TTouchEvent): Point => ({
  x: (event.touches[0].clientX + event.touches[1].clientX) / 2,
  y: (event.touches[0].clientY + event.touches[1].clientY) / 2,
});

export const calcFingersAngle = (event: TTouchEvent) => {
  const midpoint = calcFingersMidpoint(event);
  return calcPointAngle(touchToPoint(event.touches[0]), midpoint);
};
