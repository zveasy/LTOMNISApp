// import {SET_ID, SET_LINK_TOKEN} from './actions';

// // appReducer.ts
// export interface AppState {
//   hasViewedOnboarding: boolean;
//   isSignedIn: boolean;
//   id: string;
//   linkToken: string;
//   isVisible: boolean;
// }

// // Initial state
// // This is 
// const initialState: AppState = {
//   hasViewedOnboarding: false,
//   isSignedIn: false,
//   id: 'string',
//   linkToken: 'string',
//   isVisible: true,
// };

// // Action types
// const SET_HAS_VIEWED_ONBOARDING = 'SET_HAS_VIEWED_ONBOARDING';
// const SET_IS_SIGNED_IN = 'SET_IS_SIGNED_IN';
// const SHOW_TAB_BAR = 'SHOW_TAB_BAR';
// const HIDE_TAB_BAR = 'HIDE_TAB_BAR';

// // Reducer function
// const appReducer = (state = initialState, action: any): AppState => {
//   switch (action.type) {
//     case SET_HAS_VIEWED_ONBOARDING:
//       return {...state, hasViewedOnboarding: action.payload};
//     case SET_IS_SIGNED_IN:
//       return {...state, isSignedIn: action.payload};
//     case SET_ID:
//       return {
//         ...state,
//         id: action.payload,
//       };
//     case SET_LINK_TOKEN:
//       return {
//         ...state,
//         linkToken: action.payload, // Ensure this expects a string
//       };
//     case SHOW_TAB_BAR:
//       return {...state, isTabBarVisible: true};
//     case HIDE_TAB_BAR:
//       return {...state, isTabBarVisible: false};
//     default:
//       return state;
//   }
// };

// export const showTabBar = () => ({ type: SHOW_TAB_BAR });
// export const hideTabBar = () => ({ type: HIDE_TAB_BAR });


// export default appReducer;
