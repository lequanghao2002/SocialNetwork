import { createSlice } from '@reduxjs/toolkit';
import {
    acceptFriendRequestThunk,
    cancelFriendRequestThunk,
    declineFriendRequestThunk,
    fetchProfileThunk,
    sendFriendRequestThunk,
    sendUnfriendRequestThunk,
    updateProfileDetailThunk,
    updateProfileInfoThunk,
} from './userThunk';
import FriendShipStatus from '~/constants/friendshipStatus';

const initialState = {
    profile: null,
    loadings: {
        page: true,
        addButton: false,
        acceptButton: false,
        cancelButton: false,
    },
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setProfile: (state, action) => {
            state.profile = action.payload;
        },
        setFriendShip: (state, action) => {
            console.log('chạy nè');
            state.profile.friendShip = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfileThunk.pending, (state) => {
                state.loadings['page'] = true;
            })
            .addCase(fetchProfileThunk.fulfilled, (state, action) => {
                console.log(action.payload);
                state.profile = action.payload;
                state.loadings['page'] = false;
            })
            .addCase(fetchProfileThunk.rejected, (state) => {
                state.loadings['page'] = false;
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
            })

            .addCase(sendFriendRequestThunk.pending, (state, action) => {
                state.loadings['addButton'] = true;
            })
            .addCase(sendFriendRequestThunk.fulfilled, (state, action) => {
                state.profile.friendShip = action.payload;
                state.loadings['addButton'] = false;
            })
            .addCase(sendFriendRequestThunk.rejected, (state, action) => {
                state.loadings['addButton'] = false;
            })

            .addCase(cancelFriendRequestThunk.pending, (state, action) => {
                state.loadings['cancelButton'] = true;
            })
            .addCase(cancelFriendRequestThunk.fulfilled, (state, action) => {
                if (action.payload) {
                    state.profile.friendShip = null;
                }
                state.loadings['cancelButton'] = false;
            })
            .addCase(cancelFriendRequestThunk.rejected, (state, action) => {
                state.loadings['cancelButton'] = false;
            })

            .addCase(declineFriendRequestThunk.pending, (state, action) => {
                state.loadings['cancelButton'] = true;
            })
            .addCase(declineFriendRequestThunk.fulfilled, (state, action) => {
                if (action.payload) {
                    state.profile.friendShip = null;
                }
                state.loadings['cancelButton'] = false;
            })
            .addCase(declineFriendRequestThunk.rejected, (state, action) => {
                state.loadings['cancelButton'] = false;
            })

            .addCase(acceptFriendRequestThunk.pending, (state, action) => {
                state.loadings['acceptButton'] = true;
            })
            .addCase(acceptFriendRequestThunk.fulfilled, (state, action) => {
                if (action.payload) {
                    state.profile.friendShip.status = FriendShipStatus.FRIENDS;
                }
                state.loadings['acceptButton'] = false;
            })
            .addCase(acceptFriendRequestThunk.rejected, (state, action) => {
                state.loadings['acceptButton'] = false;
            })

            .addCase(sendUnfriendRequestThunk.fulfilled, (state, action) => {
                state.profile.friendShip = null;
            });
    },
});

export const { setFriendShip, setProfile } = userSlice.actions;

export default userSlice;
