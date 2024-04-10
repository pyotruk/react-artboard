export interface IValueScale {
  value: number;
  originalRange: [number, number];
  targetRange: [number, number];
}

function scaleValue({ value, originalRange, targetRange }: IValueScale): number {
  return (value - originalRange[0]) * (targetRange[1] - targetRange[0]) / (originalRange[1] - originalRange[0]) + targetRange[0];
}

export { scaleValue };
