import { createAsyncThunk } from '@reduxjs/toolkit';
import userService from '~/services/userService';

/*
  => chat/fetchListFriendShip/pending
  => chat/fetchListFriendShip/fullfilled
  => chat/fetchListFriendShip/rejected
*/
export const fetchFriendsThunk = createAsyncThunk('chat/fetchFriends', async (userId, { rejectWithValue }) => {
    try {
        const result = await userService.getListFriendship(userId);
        return result;
    } catch (error) {
        return rejectWithValue(error);
    }
});
