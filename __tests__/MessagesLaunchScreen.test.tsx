import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import MessagesLaunchScreen from '../screens/Onboarding/MessagesLaunchScreen';

// Mock React Navigation navigation prop
const mockNavigate = jest.fn();
const mockPopToTop = jest.fn();

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({ navigate: mockNavigate, popToTop: mockPopToTop }),
  };
});

// Mock AppState from React Native
jest.mock('react-native/Libraries/AppState/AppState', () => {
  const listeners = new Set();
  let currentState = 'background';

  return {
    addEventListener: (_: string, cb: any) => {
      listeners.add(cb);
      return { remove: () => listeners.delete(cb) };
    },
    currentState,
    changeState: (newState: string) => {
      currentState = newState;
      listeners.forEach((cb: any) => cb(newState));
    },
  };
});

// Import the mocked AppState after jest.mock so it receives the mock implementation
// eslint-disable-next-line @typescript-eslint/no-var-requires
const AppState = require('react-native/Libraries/AppState/AppState');

describe('MessagesLaunchScreen', () => {
  it('shows Get Started button', () => {
    const { getByTestId, getByText } = render(
      <MessagesLaunchScreen
        // @ts-expect-error partial props for testing
        navigation={{ navigate: mockNavigate, popToTop: mockPopToTop }}
        route={{ key: 'MessagesLaunch', name: 'MessagesLaunch' } as any}
      />,
    );

    const getStartedButton = getByTestId('getStartedButton');
    expect(getStartedButton).toBeTruthy();
    expect(getByText('Get Started')).toBeTruthy();
  });
});
