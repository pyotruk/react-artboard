export const createMockFunc = (props: string[]) => props.reduce((prop: any, key) => {
  // eslint-disable-next-line no-param-reassign
  prop[key] = jest.fn();
  return prop;
}, {});
