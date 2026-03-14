import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface Group {
  id: string;
  [key: string]: any;
}

interface GroupsState {
  myGroups: Group[];
  allGroups: Group[];
  activeGroup: Group | null;
  loading: boolean;
}

const initialState: GroupsState = {
  myGroups: [],
  allGroups: [],
  activeGroup: null,
  loading: false,
};

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    setMyGroups(state, action: PayloadAction<Group[]>) {
      state.myGroups = action.payload;
    },
    setAllGroups(state, action: PayloadAction<Group[]>) {
      state.allGroups = action.payload;
    },
    setActiveGroup(state, action: PayloadAction<Group | null>) {
      state.activeGroup = action.payload;
    },
    clearGroups(state) {
      state.myGroups = [];
      state.allGroups = [];
      state.activeGroup = null;
    },
  },
});

export const {setMyGroups, setAllGroups, setActiveGroup, clearGroups} = groupsSlice.actions;
export default groupsSlice.reducer;
