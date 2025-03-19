import { createSlice } from '@reduxjs/toolkit';
import { fetchProfileThunk, updateProfileDetailThunk, updateProfileInfoThunk } from './userThunk';

const initialState = {
    profile: null,
    loading: true,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfileThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProfileThunk.fulfilled, (state, action) => {
                state.profile = action.payload;
                state.loading = false;
            })
            .addCase(fetchProfileThunk.rejected, (state) => {
                state.profile = null;
                state.loading = false;
            })

            .addCase(updateProfileInfoThunk.fulfilled, (state, action) => {
                const { firstName, lastName, avatarUrl, coverPhotoUrl } = action.payload;
                state.profile = {
                    ...state.profile,
                    firstName,
                    lastName,
                    avatarUrl,
                    userProfile: { ...state.profile.userProfile, coverPhotoUrl },
                };
            })

            .addCase(updateProfileDetailThunk.fulfilled, (state, action) => {
                state.profile.userProfile = { ...state.profile.userProfile, ...action.payload };
            });
    },
});

export default userSlice;
