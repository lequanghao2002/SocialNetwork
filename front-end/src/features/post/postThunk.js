import { createAsyncThunk } from '@reduxjs/toolkit';
import postService from '~/services/postService';

export const fetchPostsThunk = createAsyncThunk('post/fetchPosts', async ({ filter, paging }, { rejectWithValue }) => {
    try {
        console.log({ filter, paging });
        const result = await postService.get(filter.status, paging.page, paging.pageSize);

        return result;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const deletePostThunk = createAsyncThunk('post/deletePostThun', async (id, { rejectWithValue }) => {
    try {
        const result = await postService.delete(id);

        return result ? id : rejectWithValue('Failed to delete post');
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});
