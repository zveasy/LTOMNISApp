// Minimal typings to satisfy TS for tests without altering runtime
declare module '@testing-library/react-native' {
  export const render: any;
  export const fireEvent: any;
  export const act: any;
}
