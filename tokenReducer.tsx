// tokenReducer.ts
import { SET_TOKEN, REMOVE_TOKEN } from './actions';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TokenState {
  token: string;
}

const initialTokenState: TokenState = {
  token: '',
};

const tokenReducer = (state: TokenState = initialTokenState, action: any): TokenState => {
  switch (action.type) {
    case SET_TOKEN:
      if (action.payload) {
        AsyncStorage.setItem('token', action.payload);
      } else {
        AsyncStorage.removeItem('token');
      }
      return { ...state, token: action.payload };
    case REMOVE_TOKEN:
      AsyncStorage.removeItem('token');
      return { ...state, token: '' };
    default:
      return state;
  }
};

export default tokenReducer;