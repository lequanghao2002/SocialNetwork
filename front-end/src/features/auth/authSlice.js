import { createSlice } from '@reduxjs/toolkit';
import { fetchUserThunk } from './authThunk';
import { removeLocalStorage } from '~/utils/localStorage';

const initialState = {
    user: null,
    loading: true,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = null;
            removeLocalStorage('token');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserThunk.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
            })
            .addCase(fetchUserThunk.rejected, (state) => {
                state.user = null;
                state.loading = false;
            });
    },
});

export const { setUser, logout } = authSlice.actions;

export default authSlice;
