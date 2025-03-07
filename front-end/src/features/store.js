import { configureStore } from '@reduxjs/toolkit';
import chatSlice from './chat/chatSlice';
import authSlice from './auth/authSlice';

const store = configureStore({
    reducer: {
        chat: chatSlice.reducer,
        auth: authSlice.reducer,
    },
});

export default store;
