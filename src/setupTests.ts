import '@testing-library/jest-dom';

jest.mock('uuid', () => ({
  v4: () => 'mocked-uuid',
}));

jest.mock('shared/redux/hooks', () => ({
  useAppSelector: (cb: any) => cb(),
}));
