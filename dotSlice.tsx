// dotSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DotState {
  currentDot: number;
}

const initialState: DotState = {
  currentDot: 0,
};

const dotSlice = createSlice({
  name: 'dot',
  initialState,
  reducers: {
    setCurrentDot: (state, action: PayloadAction<number>) => {
      state.currentDot = action.payload;
    },
  },
});

export const { setCurrentDot } = dotSlice.actions;
export default dotSlice.reducer;
