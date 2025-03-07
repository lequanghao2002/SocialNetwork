import { configureStore } from '@reduxjs/toolkit';
import chatSlice from './chat/chatSlice';
import postSlice from './post/postSlice';

const store = configureStore({
    reducer: {
        chat: chatSlice.reducer,
        post: postSlice.reducer,
    },
});

export default store;
