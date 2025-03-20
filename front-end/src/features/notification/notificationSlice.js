import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    notifications: [],
    unreadCount: 0,
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
            state.unreadCount += 1;
        },
        deleteNotification: (state, action) => {
            state.notifications = state.notifications.filter((noti) => noti.id != action.payload);
            state.unreadCount -= 1;
        },
        markAsRead: (state) => {
            state.unreadCount = 0;
        },
    },
    extraReducers: (builder) => {
        builder;
    },
});

export const { addNotification, deleteNotification } = notificationSlice.actions;

export default notificationSlice;
