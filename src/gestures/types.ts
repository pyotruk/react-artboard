import { MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from 'react';

export type Point = { x: number; y: number };

export type TMouseEvent = MouseEvent | ReactMouseEvent;
export type TTouchEvent = TouchEvent | ReactTouchEvent;
