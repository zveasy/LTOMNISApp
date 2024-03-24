// navigationTypes.ts
import { StackNavigationProp } from '@react-navigation/stack';

export type SplashScreenNavigationProp = StackNavigationProp<
  Record<string, never>,
  'SplashScreen'
>;
