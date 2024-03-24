// actions/languageActions.ts
import {SET_LANGUAGE, SetLanguageAction} from '../../types';

export const setLanguage = (language: string): SetLanguageAction => ({
  type: SET_LANGUAGE,
  payload: language,
});
