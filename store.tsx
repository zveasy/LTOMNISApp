// store.ts
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer'; // Make sure rootReducer is correctly set up


const store = configureStore({
  reducer: {
    ...rootReducer,
  },
});

console.log('Initial state:', store.getState());

export default store;
