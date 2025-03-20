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

export const sendFriendRequestThunk = createAsyncThunk('user/sendFriendRequest', async (id, { rejectWithValue }) => {
    try {
        const result = await userService.sendFriendRequest(id);
        return result;
    } catch (error) {
        return rejectWithValue(error.response?.data);
    }
});

export const cancelFriendRequestThunk = createAsyncThunk(
    'user/cancelFriendRequest',
    async (id, { rejectWithValue }) => {
        try {
            const result = await userService.cancelFriendRequest(id);
            return result;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    },
);

export const declineFriendRequestThunk = createAsyncThunk(
    'user/declineFriendRequest',
    async (id, { rejectWithValue }) => {
        try {
            const result = await userService.declineFriendRequest(id);
            return result;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    },
);

export const acceptFriendRequestThunk = createAsyncThunk(
    'user/acceptFriendRequest',
    async (id, { rejectWithValue }) => {
        try {
            const result = await userService.accepteFriendRequest(id);
            return result;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    },
);

export const sendUnfriendRequestThunk = createAsyncThunk(
    'user/sendUnfriendRequest',
    async (id, { rejectWithValue }) => {
        try {
            const result = await userService.sendUnfriendRequest(id);
            return result;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    },
);
