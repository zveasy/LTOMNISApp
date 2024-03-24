// combinedReducer.ts
import {SET_TOKEN, REMOVE_TOKEN, SET_LINK_TOKEN, SET_ID} from './actions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  token: '',
  hasCompletedOnboarding: false,
  linkToken: '',
  id: null,
};

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_TOKEN:
      return {...state, token: action.payload};
    case SET_LINK_TOKEN:
      return {
        ...state,
        linkToken: action.payload, // Ensure this expects a string
      };
    case SET_ID:
      return {
        ...state,
        id: action.payload,
      };
    case REMOVE_TOKEN:
      return {...state, token: ''};
    default:
      return state;
  }
};

export default reducer;
