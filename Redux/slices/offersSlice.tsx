import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface Offer {
  id: string;
  [key: string]: any;
}

interface OffersState {
  offers: Offer[];
  activeOffer: Offer | null;
  loading: boolean;
}

const initialState: OffersState = {
  offers: [],
  activeOffer: null,
  loading: false,
};

const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    setOffers(state, action: PayloadAction<Offer[]>) {
      state.offers = action.payload;
    },
    setActiveOffer(state, action: PayloadAction<Offer | null>) {
      state.activeOffer = action.payload;
    },
    clearOffers(state) {
      state.offers = [];
      state.activeOffer = null;
    },
  },
});

export const {setOffers, setActiveOffer, clearOffers} = offersSlice.actions;
export default offersSlice.reducer;
