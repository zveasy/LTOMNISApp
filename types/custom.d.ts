// Extend jest matchers for react-native testing library
// to support toBeDisabled matcher
declare namespace jest {
  interface Matchers<R> {
    toBeDisabled(): R;
  }
}
