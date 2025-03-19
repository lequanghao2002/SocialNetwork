import { createAsyncThunk } from '@reduxjs/toolkit';
import userService from '~/services/userService';

export const fetchProfileThunk = createAsyncThunk('user/fetchProfile', async (id, { rejectWithValue }) => {
    try {
        const result = await userService.getById(id);
        return result;
    } catch (error) {
        return rejectWithValue(error.response?.data);
    }
});

export const updateProfileInfoThunk = createAsyncThunk('user/updateProfileInfo', async (data, { rejectWithValue }) => {
    try {
        const result = await userService.updateProfileInfo(data);
        return result;
    } catch (error) {
        return rejectWithValue(error.response?.data);
    }
});

export const updateProfileDetailThunk = createAsyncThunk(
    'user/updateProfileDetail',
    async (data, { rejectWithValue }) => {
        try {
            const result = await userService.updateProfileDetail(data);
            return result;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    },
);
