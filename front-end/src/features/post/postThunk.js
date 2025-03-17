import { createAsyncThunk } from '@reduxjs/toolkit';
import commentService from '~/services/commentService';
import postService from '~/services/postService';

export const fetchPostsThunk = createAsyncThunk('post/fetchPosts', async (_, { rejectWithValue, getState }) => {
    try {
        const state = getState();
        const filter = state.post.filter;
        const paging = state.post.paging;

        const result = await postService.get(filter.status, paging.page, paging.pageSize);

        return {
            data: result,
            page: paging.page,
            hasMore: result.length >= paging.pageSize,
        };
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const fetchSavedPostsThunk = createAsyncThunk(
    'post/fetchSavedPosts',
    async (_, { rejectWithValue, getState }) => {
        try {
            const state = getState();
            const paging = state.post.paging;

            const result = await postService.getAllSaved(paging.page, paging.pageSize);

            return {
                data: result,
                page: paging.page,
                hasMore: result.length >= paging.pageSize,
            };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    },
);

export const deletePostThunk = createAsyncThunk('post/deletePost', async (id, { rejectWithValue }) => {
    try {
        const result = await postService.delete(id);

        return result ? id : rejectWithValue('Failed to delete post');
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const savePostThunk = createAsyncThunk('post/savePost', async (id, { rejectWithValue }) => {
    try {
        const result = await postService.save({ postId: id });

        return { postId: id, userId: result };
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const unSavePostThunk = createAsyncThunk('post/unSavePost', async (id, { rejectWithValue }) => {
    try {
        const result = await postService.unSave({ postId: id });

        if (result) {
            return { postId: id, userId: result };
        }
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const fetchCommentsThunk = createAsyncThunk('post/fetchComments', async (id, { rejectWithValue }) => {
    try {
        const result = await commentService.getByPostId(id);

        if (result) {
            return { postId: id, comments: result };
        }
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});
