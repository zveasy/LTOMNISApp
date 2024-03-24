// tokenReducer.ts
import { SET_TOKEN, REMOVE_TOKEN } from './actions';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TokenState {
  token: string;
}

const tokenReducer = (state: TokenState, action: any): TokenState => {
  switch (action.type) {
    case SET_TOKEN:
      AsyncStorage.setItem('token', action.payload);
      return { ...state, token: action.payload };
    case REMOVE_TOKEN:
      AsyncStorage.removeItem('token');
      return { ...state, token: '' };
    default:
      return state;
  }
};

export default tokenReducer;