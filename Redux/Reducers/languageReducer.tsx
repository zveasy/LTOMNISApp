// languageReducer.tsx
import {LanguageActionTypes} from '../../types';

export interface LanguageInitialState {
  language: string; // default language
}

const languageInitialState: LanguageInitialState = {
  language: 'en',
};

const languageReducer = (
  state: LanguageInitialState = languageInitialState,
  action: LanguageActionTypes,
) => {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload,
      };
    default:
      return state;
  }
};

export default languageReducer;
