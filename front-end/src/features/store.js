import { configureStore } from '@reduxjs/toolkit';
import chatSlice from './chat/chatSlice';
import authSlice from './auth/authSlice';
import postSlice from './post/postSlice';
import modalSlice from './modal/modalSlice';
import userSlice from './user/userSlice';
import notificationSlice from './notification/notificationSlice';

const store = configureStore({
    reducer: {
        modal: modalSlice.reducer,
        auth: authSlice.reducer,
        user: userSlice.reducer,
        chat: chatSlice.reducer,
        post: postSlice.reducer,
        notification: notificationSlice.reducer,
    },
});

export default store;
