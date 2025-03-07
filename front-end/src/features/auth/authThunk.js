import { createAsyncThunk } from '@reduxjs/toolkit';
import authService from '~/services/authService';
import { getLocalStorage } from '~/utils/localStorage';

export const fetchUserThunk = createAsyncThunk('auth/fetchUser', async (_, { rejectWithValue }) => {
    try {
        const token = getLocalStorage('token');
        if (!token) return null;

        const user = await authService.me();
        return user;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Lỗi khi lấy thông tin user');
    }
});
