import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    posts: [],
};

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload;
        },
    },
    extraReducers: (builder) => {},
});

export const { setPosts } = postSlice.actions;

export default postSlice;
