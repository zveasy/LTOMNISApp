import {combineReducers} from 'redux';
import tokenReducer, {TokenState} from './tokenReducer';
import appReducer from './appReducer';
import languageReducer from './Redux/Reducers/languageReducer';
import verifyReducer from './verifyReducer';
import tabBarReducer from './tabBarSlice';
export interface AppState {
  token: ReturnType<typeof tokenReducer>
  app: ReturnType<typeof appReducer>;
  language: ReturnType<typeof languageReducer>;
  tabBar: ReturnType<typeof tabBarReducer>;
  verify: ReturnType<typeof verifyReducer>; // Add this line
}

const rootReducer = combineReducers({
  token: tokenReducer,
  app: appReducer,
  language: languageReducer,
  tabBar: tabBarReducer,
  verify: verifyReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
