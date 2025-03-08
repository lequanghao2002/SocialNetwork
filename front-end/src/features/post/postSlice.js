import { createSlice } from '@reduxjs/toolkit';
import { fetchPostsThunk } from './postThunk';

const initialState = {
    posts: [],
    loading: false,
    paging: {
        page: 1,
        pageSize: 10,
    },
    filter: {
        status: 'Recent',
    },
};

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        // setPosts: (state, action) => {
        //     state.posts = action.payload;
        // },
        setStatus: (state, action) => {
            state.filter.status = action.payload;
        },
        addPost: (state, action) => {
            state.posts.unshift(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPostsThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPostsThunk.fulfilled, (state, action) => {
                state.posts = action.payload;
                state.loading = false;
            })
            .addCase(fetchPostsThunk.rejected, (state) => {
                state.loading = false;
            });
    },
});

export const { setPosts, setStatus, addPost } = postSlice.actions;

export default postSlice;
