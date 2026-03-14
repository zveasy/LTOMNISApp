import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface Post {
  id: string;
  [key: string]: any;
}

interface PostsState {
  posts: Post[];
  myPosts: Post[];
  searchResults: Post[];
  loading: boolean;
}

const initialState: PostsState = {
  posts: [],
  myPosts: [],
  searchResults: [],
  loading: false,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts(state, action: PayloadAction<Post[]>) {
      state.posts = action.payload;
    },
    setMyPosts(state, action: PayloadAction<Post[]>) {
      state.myPosts = action.payload;
    },
    setSearchResults(state, action: PayloadAction<Post[]>) {
      state.searchResults = action.payload;
    },
    clearPosts(state) {
      state.posts = [];
      state.myPosts = [];
      state.searchResults = [];
    },
  },
});

export const {setPosts, setMyPosts, setSearchResults, clearPosts} = postsSlice.actions;
export default postsSlice.reducer;
