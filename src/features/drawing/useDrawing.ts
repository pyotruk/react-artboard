import { useCallback } from 'react';

const useDrawing = () => {
  const beginBrush = useCallback((x: number, y: number, ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = 'lightblue';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
  }, []);

  const continueBrush = useCallback((x: number, y: number, ctx: CanvasRenderingContext2D) => {
    ctx.lineTo(x, y);
    ctx.stroke();
  }, []);

  const endBrush = useCallback((x: number, y: number, ctx: CanvasRenderingContext2D) => {
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.closePath();
  }, []);

  return {
    beginBrush,
    continueBrush,
    endBrush,
  };
};

export default useDrawing;
