import AsyncStorage from '@react-native-async-storage/async-storage';
import {Dispatch} from 'react';

// actions.ts
export const SET_TOKEN = 'SET_TOKEN';
export const REMOVE_TOKEN = 'REMOVE_TOKEN';
export const SET_HAS_VIEWED_ONBOARDING = 'SET_HAS_VIEWED_ONBOARDING';
export const SET_IS_SIGNED_IN = 'SET_IS_SIGNED_IN';
export const SET_LINK_TOKEN = 'SET_LINK_TOKEN';
export const SET_AUTH_TOKEN = 'SET_AUTH_TOKEN';
export const SET_ID = 'SET_LINK_TOKEN';
export const SET_USER_PHONE_NUMBER = 'SET_USER_PHONE_NUMBER';

type ActionType =
  | {type: typeof SET_TOKEN; payload: string}
  | {type: typeof REMOVE_TOKEN}
  | {type: typeof SET_HAS_VIEWED_ONBOARDING; payload: boolean}
  | {type: typeof SET_IS_SIGNED_IN; payload: boolean}
  | {type: typeof SET_LINK_TOKEN; payload: string}
  | {type: typeof SET_AUTH_TOKEN; payload: string}
  | {type: typeof SET_ID; payload: string}
  | {type: typeof SET_USER_PHONE_NUMBER; payload: string};

// In your actions file
export const setToken =
  (token: string) => async (dispatch: Dispatch<ActionType>) => {
    await AsyncStorage.setItem('token', token);
    dispatch({
      type: SET_TOKEN,
      payload: token,
    });
  };

export const removeToken = () => async (dispatch: Dispatch<ActionType>) => {
  await AsyncStorage.removeItem('token');
  dispatch({
    type: REMOVE_TOKEN,
  });
};

export const setHasViewedOnboarding = (value: boolean) => ({
  type: SET_HAS_VIEWED_ONBOARDING,
  payload: value,
});

export const setUserPhoneNumber = (phoneNumber: string) => ({
  type: SET_USER_PHONE_NUMBER,
  payload: phoneNumber,
});

export const setIsSignedIn = (value: boolean) => ({
  type: SET_IS_SIGNED_IN,
  payload: value,
});

export const toggleTabBar = (isVisible: boolean) => ({
  type: 'TOGGLE_TAB_BAR',
  payload: isVisible,
});

export const setLinkToken = (linkToken: string) => ({
  type: SET_LINK_TOKEN,
  payload: linkToken,
});

export const setAuthToken = (authToken: string) => ({
  type: SET_AUTH_TOKEN,
  payload: authToken,
});

export const setId = (id: string) => ({
  type: SET_ID,
  payload: id,
});

export const setHasCompletedOnboarding = (hasCompleted: boolean) => ({
  type: 'SET_HAS_COMPLETED_ONBOARDING',
  payload: hasCompleted,
});
