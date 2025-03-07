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
            console.log('setFriends', state, action);

            state.friends = action.payload.map((friend) => ({
                info: friend,
                message: {
                    content: '',
                    imageUrl: '',
                },
                chat: [],
            }));
            state.selectedFriendId = action.payload[0].id || null;
        }, // action creators
        setSelectedFriendId: (state, action) => {
            console.log('setSelectedFriendId', state, action);
            state.selectedFriendId = action.payload;
        },
        setMessage: (state, action) => {
            console.log('setMessage', state, action);
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
            const friendIndex = state.friends.findIndex(
                (friend) => friend.info.id === action.payload.senderId || friend.info.id === action.payload.receiverId,
            );

            if (friendIndex !== -1) {
                const updatedFriend = {
                    ...state.friends[friendIndex],
                    info: {
                        ...state.friends[friendIndex].info,
                        lastMessage: action.payload,
                    },
                    chat: [...state.friends[friendIndex].chat, action.payload],
                };

                state.friends.splice(friendIndex, 1);
                state.friends.unshift(updatedFriend);
            }
        },
        updateMessageInChat: (state, action) => {
            // state.friends.forEach((friend) => {
            //     if (friend.info.id === action.payload.senderId || friend.info.id === action.payload.receiverId) {
            //         friend.chat = friend.chat.map((msg) => (msg.id === action.payload.id ? action.payload : msg));
            //     }
            // });

            const friend = state.friends.find(
                (friend) => friend.info.id === action.payload.senderId || friend.info.id === action.payload.receiverId,
            );
            if (friend) {
                friend.chat = friend.chat.map((msg) => (msg.id === action.payload.id ? action.payload : msg));
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
