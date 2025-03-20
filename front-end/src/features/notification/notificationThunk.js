import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchNotificationsThunk = createAsyncThunk(
    'notification/fetchNotifications',
    async (id, { rejectWithValue }) => {
        try {
            // const result = await userService.getById(id);
            // return result;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    },
);
