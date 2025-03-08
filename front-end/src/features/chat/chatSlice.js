import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import userService from '~/services/userService';
import { fetchFriendsThunk } from './chatThunks';

const initialState = {
    friends: [
        {
            info: {
                id: null,
                firstName: null,
                lastName: null,
                avatarUrl: null,
                userProfile: {},
                lastMessage: {},
            },
            message: {
                content: null,
                imageUrl: null,
            },
            chat: [],
        },
    ],
    selectedFriendId: null, // id
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        // IMMER
        setFriends: (state, action) => {
            state.friends = action.payload.map((friend) => ({
                info: friend,
                message: {
                    content: '',
                    imageUrl: '',
                },
                chat: [],
            }));

            state.selectedFriendId = action.payload.length > 0 ? action.payload[0].id : null;
        }, // action creators
        setSelectedFriendId: (state, action) => {
            state.selectedFriendId = action.payload;
        },
        setMessage: (state, action) => {
            const friend = state.friends.find((friend) => friend.info.id === state.selectedFriendId);
            if (friend) {
                friend.message = action.payload;
            }
        },
        setChat: (state, action) => {
            const friend = state.friends.find((friend) => friend.info.id === state.selectedFriendId);
            if (friend) {
                friend.chat = action.payload;
            }
        },
        addMessageToChat: (state, action) => {
            const friend = state.friends.find(
                (friend) => friend.info.id === action.payload.senderId || friend.info.id === action.payload.receiverId,
            );

            if (friend) {
                friend.info.lastMessage = action.payload;
                friend.chat.push(action.payload);

                state.friends.sort((a, b) =>
                    a.info.lastMessage?.createdDate < b.info.lastMessage?.createdDate ? 1 : -1,
                );
            }
        },
        updateMessageInChat: (state, action) => {
            const friend = state.friends.find(
                (friend) => friend.info.id === action.payload.senderId || friend.info.id === action.payload.receiverId,
            );
            if (friend) {
                const message = friend.chat.find((msg) => msg.id === action.payload.id);

                if (message) {
                    Object.assign(message, action.payload);
                }
            }
        },
        markMessageAsSeen: (state, action) => {
            const friend = state.friends.find((friend) => friend.info.id === state.selectedFriendId);
            if (friend) {
                friend.info.lastMessage.isSeen = action.payload;
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchFriendsThunk.fulfilled, (state, action) => {
            if (action.payload.length > 0) {
                state.friends = action.payload.map((friend) => ({
                    info: friend,
                    message: { content: '', imageUrl: '' },
                    chat: [],
                }));
                state.selectedFriendId = action.payload[0].id;
            }
        });
    },
});

export const {
    setFriends,
    setSelectedFriendId,
    setMessage,
    setChat,
    addMessageToChat,
    updateMessageInChat,
    markMessageAsSeen,
} = chatSlice.actions;

export default chatSlice;
