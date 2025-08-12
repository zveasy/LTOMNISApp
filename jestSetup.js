// Jest setup for React Native mocks
import 'react-native-gesture-handler/jestSetup';
// Patch BackHandler to avoid undefined addEventListener in tests
const RN_forBackHandler = require('react-native');
if (RN_forBackHandler.BackHandler) {
  RN_forBackHandler.BackHandler.addEventListener = jest.fn(() => ({ remove: jest.fn() }));
  RN_forBackHandler.BackHandler.removeEventListener = jest.fn();
}
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Silence NativeAnimatedHelper warnings
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock vector icons
jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');

// Mock Google Signin native module
jest.mock('@react-native-google-signin/google-signin', () => {
  const mockGoogleSignin = {
    configure: jest.fn(),
    hasPlayServices: jest.fn().mockResolvedValue(true),
    signIn: jest.fn().mockResolvedValue({
      idToken: 'test-id-token',
      user: {email: 'test@example.com'},
    }),
    signOut: jest.fn().mockResolvedValue(undefined),
    revokeAccess: jest.fn().mockResolvedValue(undefined),
    isSignedIn: jest.fn().mockResolvedValue(false),
    getCurrentUser: jest.fn().mockResolvedValue(null),
  };
  return {
    GoogleSignin: mockGoogleSignin,
    GoogleSigninButton: 'GoogleSigninButton',
    statusCodes: {SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED'},
  };
});

// Mock @react-navigation/native to avoid BackHandler usage in tests
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  const React = require('react');
  return {
    __esModule: true,
    ...actual,
    useBackButton: jest.fn(),
    NavigationContainer: ({children}) => React.createElement(React.Fragment, null, children),
  };
});

// Mock @react-navigation/native-stack
jest.mock('@react-navigation/native-stack', () => {
  const React = require('react');
  function createNativeStackNavigator() {
    const Navigator = ({children}) => React.createElement(React.Fragment, null, children);
    const Screen = ({children}) => React.createElement(React.Fragment, null, children);
    const Group = ({children}) => React.createElement(React.Fragment, null, children);
    return {Navigator, Screen, Group};
  }
  return {__esModule: true, createNativeStackNavigator};
});

// Mock react-native-screens
jest.mock('react-native-screens', () => {
  const React = require('react');
  const View = require('react-native').View;
  const MockScreen = ({children}) => React.createElement(View, null, children);
  return {
    __esModule: true,
    enableScreens: jest.fn(),
    screensEnabled: jest.fn().mockReturnValue(false),
    NativeScreen: MockScreen,
    Screen: MockScreen,
    ScreenContainer: ({children}) => React.createElement(View, null, children),
  };
});

// Mock @react-navigation/elements SafeAreaProviderCompat
jest.mock('@react-navigation/elements', () => {
  const React = require('react');
  return {
    __esModule: true,
    // Keep other exports minimal if needed later
    SafeAreaProviderCompat: ({children}) => React.createElement(React.Fragment, null, children),
  };
});

// Mock victory-native
jest.mock('victory-native', () => {
  const React = require('react');
  const Mock = ({children}) => React.createElement('View', null, children);
  return {
    __esModule: true,
    VictoryLine: Mock,
    VictoryChart: Mock,
    VictoryTheme: {},
  };
});

// Mock image picker (both old and new packages)
jest.mock('react-native-image-picker', () => ({
  launchCamera: jest.fn().mockResolvedValue({didCancel: true}),
  launchImageLibrary: jest.fn().mockResolvedValue({didCancel: true}),
}));

// Mock react-native-plaid-link-sdk
jest.mock('react-native-plaid-link-sdk', () => {
  const React = require('react');
  const MockPlaidLink = ({children}) => React.createElement('PlaidLink', null, children);
  return {
    __esModule: true,
    default: MockPlaidLink,
    PlaidLink: MockPlaidLink,
    openLink: jest.fn(),
    dismissLink: jest.fn(),
    usePlaidEmitter: jest.fn(() => ({
      removeAllListeners: jest.fn(),
      addListener: jest.fn(),
    })),
  };
});

// Mock react-native-raw-bottom-sheet
jest.mock('react-native-raw-bottom-sheet', () => {
  const React = require('react');
  const Mock = React.forwardRef((props, ref) => React.createElement('RBSheet', {...props, ref}));
  return {
    __esModule: true,
    default: Mock,
  };
});

// Mock react-native-linear-gradient
jest.mock('react-native-linear-gradient', () => 'LinearGradient');

// Mock react-native-modal
jest.mock('react-native-modal', () => {
  const React = require('react');
  return ({children}) => React.createElement('Modal', null, children);
});

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const MockProvider = ({children}) => React.createElement('SafeAreaProvider', null, children);
  return {
    __esModule: true,
    SafeAreaProvider: MockProvider,
    SafeAreaView: ({children}) => children,
    useSafeAreaInsets: () => ({top: 0, bottom: 0, left: 0, right: 0}),
    useSafeAreaFrame: () => ({x: 0, y: 0, width: 320, height: 640}),
    initialWindowMetrics: {
      frame: {x: 0, y: 0, width: 0, height: 0},
      insets: {top: 0, bottom: 0, left: 0, right: 0},
    },
  };
});

// Enable jest-native matchers like toBeDisabled
import '@testing-library/jest-native/extend-expect';
