import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface Contract {
  id: string;
  [key: string]: any;
}

interface ContractsState {
  contracts: Contract[];
  activeContract: Contract | null;
  loading: boolean;
}

const initialState: ContractsState = {
  contracts: [],
  activeContract: null,
  loading: false,
};

const contractsSlice = createSlice({
  name: 'contracts',
  initialState,
  reducers: {
    setContracts(state, action: PayloadAction<Contract[]>) {
      state.contracts = action.payload;
    },
    setActiveContract(state, action: PayloadAction<Contract | null>) {
      state.activeContract = action.payload;
    },
    clearContracts(state) {
      state.contracts = [];
      state.activeContract = null;
    },
  },
});

export const {setContracts, setActiveContract, clearContracts} = contractsSlice.actions;
export default contractsSlice.reducer;
