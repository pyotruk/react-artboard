import { scaleValue, IValueScale } from './range';

type TScaleValueProps = {
  args: IValueScale;
  expectedResult: number;
}

describe('scaleValue', () => {
  test.each([
    { args: { value: 5, originalRange: [0, 10], targetRange: [100, 200] }, expectedResult: 150 },
    { args: { value: 7, originalRange: [5, 10], targetRange: [0, 100] }, expectedResult: 40 },
    { args: { value: 7, originalRange: [5, 10], targetRange: [100, 200] }, expectedResult: 140 },
    { args: { value: 7, originalRange: [5, 10], targetRange: [200, 300] }, expectedResult: 240 },
    { args: { value: -5, originalRange: [-10, 10], targetRange: [0, 100] }, expectedResult: 25 },
  ] as TScaleValueProps[])(
    'given { value: $args.value, originalRange: $args.originalRange, targetRange: $args.targetRange }, returns $expectedResult',
    ({ args, expectedResult }) => {
      const { value, originalRange, targetRange } = args;
      const result = scaleValue({ value, originalRange, targetRange });
      expect(result).toEqual(expectedResult);
    },
  );

  test.each([
    { args: { value: 3.14, originalRange: [0, 10], targetRange: [100, 200] }, expectedResult: 131.4 },
    { args: { value: 7.89, originalRange: [5, 10], targetRange: [0, 100] }, expectedResult: 57.8 },
  ] as TScaleValueProps[])('given { value: $args.value, originalRange: $args.originalRange, targetRange: $args.targetRange }, returns $expectedResult', ({ args, expectedResult }) => {
    const { value, originalRange, targetRange } = args;
    const result = scaleValue({ value, originalRange, targetRange });
    expect(result).toBeCloseTo(expectedResult, 2);
  });

  it('Should throw if provided value is not in original range', () => {
    expect(() => scaleValue({ value: 1, originalRange: [5, 10], targetRange: [0, 100] })).toThrow('Wrong value provided, 1 is not in originalRange');
  });
});
