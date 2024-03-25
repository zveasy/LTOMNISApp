import {createStore, combineReducers} from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppActionTypes, SetAuthTokenAction, SetLinkTokenAction, TokenActionTypes} from './types'; // Adjust the import path
import tabBarReducer, {TabBarInitialState} from './tabBarSlice';
import languageReducer, {
  LanguageInitialState,
} from './Redux/Reducers/languageReducer';
import ActionItemList from './screens/OMNISScore/ScoreBreakDown/Levels/ActionItem';

// Action Types
const SET_HAS_VIEWED_ONBOARDING = 'SET_HAS_VIEWED_ONBOARDING';
const SET_IS_SIGNED_IN = 'SET_IS_SIGNED_IN';
const SET_TOKEN = 'SET_TOKEN';
const REMOVE_TOKEN = 'REMOVE_TOKEN';
const SET_LINK_TOKEN = 'SET_LINK_TOKEN';
const SET_AUTH_TOKEN = 'SET_AUTH_TOKEN';
const SET_USER_ID = 'SET_USER_ID';
const SET_USER_PHONE_NUMBER = 'SET_USER_PHONE_NUMBER';
const SET_USER_POST_ID = 'SET_USER_POST_ID';
const SET_FIRST_NAME = 'SET_FIRST_NAME';
const SET_LAST_NAME = 'SET_LAST_NAME';
const SET_PLAN = 'SET_PLAN';
const SELECT_fRIEND = 'SELECT_fRIEND';

export interface AppInitialState {
  hasViewedOnboarding: boolean;
  isSignedIn: boolean;
}

// App State and Reducer
//This is what we see in the terminal
const appInitialState: AppInitialState = {
  hasViewedOnboarding: false,
  isSignedIn: false,
};

export const setId = (id: string) => ({
  type: SET_ID,
  payload: id,
});

const UserInitialState = {
  userId: null,
};

export const setUserId = (userId: string) => ({
  type: SET_USER_ID,
  payload: userId,
});
// HHHHHHH
export const setUserPostId = (userPostId: string) => ({
  type: SET_USER_POST_ID,
  payload: userPostId,
});

export const setsUserPhoneNumber = (userPhoneNumber: string) => ({
  type: SET_USER_PHONE_NUMBER,
  payload: userPhoneNumber,
});

// actions.js or a similar file
export const setFirstName = (firstName: string) => ({
  type: 'SET_FIRST_NAME',
  payload: firstName,
});

export const setLastName = (lastName: string) => ({
  type: 'SET_LAST_NAME',
  payload: lastName,
});

const initialFirstLastState = {
  firstName: '',
  lastName: '',
};

const userFirstLastReducer = (state = initialFirstLastState, action: any) => {
  switch (action.type) {
    case SET_FIRST_NAME:
      return {
        ...state,
        firstName: action.payload,
      };
    case SET_LAST_NAME:
      return {
        ...state,
        lastName: action.payload,
      };
    default:
      return state;
  }
};

// Token State and Reducer

export interface TokenInitialState {
  token: string | null;
}

export interface Friend {
  id: string;
  firstName: string;
  lastName: string;
  avatarImage?: string;
  isFriend: boolean; // Add this line
  friends?: Array<any>; // <-- use the optional modifier (?)
}

const tokenInitialState: TokenInitialState = {
  token: null,
};

const LinkTokenInitialState: LinkTokenInitialState = {
  token: null,
  LinkToken: ''
};

const AuthLinkTokenInitialState: AuthLinkTokenInitialState = {
  authToken: null,
  LinkToken: ''
};

export interface LinkTokenInitialState {
  LinkToken: string;
  token: string | null;
}

export interface AuthLinkTokenInitialState {
  authToken: string;
}


export interface AppState {
  user: any;
  app: AppInitialState;
  token: TokenInitialState;
  language: LanguageInitialState;
  tabBar: TabBarInitialState;
  linkToken: LinkTokenInitialState;
  authToken: AuthLinkTokenInitialState;
  id: string | null;
  userId: string | null;
  userPostId: string | null;
  firstName: string | null;
  lastName: string | null;
  //verify: ReturnType<typeof verifyReducer>; // Add this line
}

const SET_ID = 'SET_ID';

export interface IdInitialState {
  id: string | null;
}

const idInitialState: IdInitialState = {
  id: null,
};

const postIdInitialState: IdInitialState = {
  id: null,
};

const SetPlanInitialState: IdInitialState = {
  id: null,
};

const idReducer = (state = idInitialState, action: any) => {
  switch (action.type) {
    case SET_ID:
      return {...state, id: action.payload};
    default:
      return state;
  }
};

const paymentPlanReducer = (state = SetPlanInitialState, action: any) => {
  switch (action.type) {
    case SET_PLAN:
      return {...state, id: action.payload};
    default:
      return state;
  }
};
// HHHHHH
const postIdReducer = (state = postIdInitialState, action: any) => {
  console.log('Action :', action);
  switch (action.type) {
    case SET_USER_POST_ID:
      return {...state, userPostId: action.payload};
    default:
      return state;
  }
};

const userReducer = (state = UserInitialState, action: any) => {
  switch (action.type) {
    case SET_USER_ID:
      return {
        ...state,
        userId: action.payload,
      };
    default:
      return state;
  }
};

const linkTokenReducer = (
  state = LinkTokenInitialState,
  action: SetLinkTokenAction,
) => {
  switch (action.type) {
    case SET_LINK_TOKEN:
      return {...state, LinkToken: action.payload};
    default:
      return state;
  }
};

const authLinkTokenReducer = (
  state = AuthLinkTokenInitialState,
  action: SetAuthTokenAction,
) => {
  switch (action.type) {
    case SET_AUTH_TOKEN:
      return {...state, authToken: action.payload};
    default:
      return state;
  }
};

const appReducer = (state = appInitialState, action: AppActionTypes) => {
  switch (action.type) {
    case SET_HAS_VIEWED_ONBOARDING:
      return {...state, hasViewedOnboarding: action.payload};
    case SET_IS_SIGNED_IN:
      return {...state, isSignedIn: action.payload};
    default:
      return state;
  }
};

const tokenReducer = (state = tokenInitialState, action: TokenActionTypes) => {
  switch (action.type) {
    case SET_TOKEN:
      return {...state, token: action.payload};
    case REMOVE_TOKEN:
      return {...state, token: null};
    default:
      return state;
  }
};

const initialStatePhone = {
  userPhoneNumber: null,
};

interface Action {
  type: any;
  payload?: any; // You can replace 'any' with a more specific type if you have a defined payload structure
}

const userPhoneNumberReducer = (state = initialStatePhone, action: Action) => {
  switch (action.type) {
    case SET_USER_PHONE_NUMBER:
      return {
        ...state,
        userPhoneNumber: action.payload, // Now action.payload is correctly recognized
      };
    default:
      return state;
  }
};

export interface FriendsInitialState {
  selectedFriendId: string | null;
}

const friendsInitialState: FriendsInitialState = {
  selectedFriendId: null,
};

export const setSelectedFriend = (selectedFriend: string) => ({
  type: 'SELECT_fRIEND',
  payload: selectedFriend,
});

const friendsReducer = (state = friendsInitialState, action: Action) => {
  switch (action.type) {
    case SELECT_fRIEND:
      return {
        ...state,
        selectedFriendId: action.payload, // Now action.payload is correctly recognized
      };
    default:
      return state;
  }
};

// Combine Reducers
const rootReducer = combineReducers({
  app: appReducer,
  token: tokenReducer,
  tabBar: tabBarReducer,
  language: languageReducer,
  linkToken: linkTokenReducer,
  authToken: authLinkTokenReducer,
  id: idReducer,
  user: userReducer,
  userPostId: postIdReducer,
  userPhoneNumber: userPhoneNumberReducer,
  userFirstLast: userFirstLastReducer,
  friends: friendsReducer,
});

// Store
const store = createStore(rootReducer);

export default store;

// Actions (Consider moving these to a separate file)
export const setHasViewedOnboarding = (value: boolean) => ({
  type: SET_HAS_VIEWED_ONBOARDING,
  payload: value,
});

export const setIsSignedIn = (value: boolean) => ({
  type: SET_IS_SIGNED_IN,
  payload: value,
});

export const setToken = (token: string) => {
  AsyncStorage.setItem('token', token);
  return {
    type: SET_TOKEN,
    payload: token,
  };
};

export const removeToken = () => {
  AsyncStorage.removeItem('token');
  return {
    type: REMOVE_TOKEN,
  };
};
