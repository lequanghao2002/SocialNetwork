import { configureStore } from '@reduxjs/toolkit';
import chatSlice from './chat/chatSlice';
import authSlice from './auth/authSlice';
import postSlice from './post/postSlice';
import modalSlice from './modal/modalSlice';
import userProfile from './user/userSlice';

const store = configureStore({
    reducer: {
        modal: modalSlice.reducer,
        auth: authSlice.reducer,
        user: userProfile.reducer,
        chat: chatSlice.reducer,
        post: postSlice.reducer,
    },
});

export default store;
