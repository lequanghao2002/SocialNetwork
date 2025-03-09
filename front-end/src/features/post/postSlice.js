import { createSlice } from '@reduxjs/toolkit';
import { deletePostThunk, fetchPostsThunk, savePostThunk, unSavePostThunk } from './postThunk';

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
        addPost: (state, action) => {
            state.posts.unshift(action.payload);
        },
        updatePost: (state, action) => {
            const post = state.posts.find((post) => post.id === action.payload.id);
            if (post) {
                Object.assign(post, action.payload);
            }
        },
        setStatus: (state, action) => {
            state.filter.status = action.payload;
        },
        setLike: (state, action) => {
            const { id, userId, type } = action.payload;
            const post = state.posts.find((post) => post.id === id);

            if (post) {
                if (type === 'add' && !post.likes.includes(userId)) {
                    post.likes.push({ userId });
                } else if (type === 'delete') {
                    post.likes = post.likes.filter((like) => like.userId !== userId);
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchPostsThunk
            .addCase(fetchPostsThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPostsThunk.fulfilled, (state, action) => {
                state.posts = action.payload;
                state.loading = false;
            })
            .addCase(fetchPostsThunk.rejected, (state) => {
                state.loading = false;
            })

            .addCase(deletePostThunk.fulfilled, (state, action) => {
                state.posts = state.posts.filter((post) => post.id !== action.payload);
            })

            .addCase(savePostThunk.fulfilled, (state, action) => {
                const { postId, userId } = action.payload;

                const post = state.posts.find((post) => post.id === postId);
                post.favourites.push({ userId });
            })

            .addCase(unSavePostThunk.fulfilled, (state, action) => {
                const { postId, userId } = action.payload;

                const post = state.posts.find((post) => post.id === postId);
                post.favourites = post.favourites.filter((favourite) => favourite.userId !== userId);
            });
    },
});

export const { setPosts, setStatus, addPost, updatePost, setLike } = postSlice.actions;

export default postSlice;
