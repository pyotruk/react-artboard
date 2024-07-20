import '@testing-library/jest-dom';

jest.mock('uuid', () => ({
  v4: () => 'mocked-uuid',
}));
