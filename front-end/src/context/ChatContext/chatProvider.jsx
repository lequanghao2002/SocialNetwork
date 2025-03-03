import { useEffect, useReducer, useState } from 'react';
import ChatReducer from './chatReducer';
import ChatContext from './chatContext';
import { ADD_MESSAGE_TO_CHAT, SET_CHAT, SET_FRIENDS, SET_MESSAGE, SET_SELECTED } from './chatTypes';
import { chatHubService } from '~/signalR/chatHubService';

function ChatProvider({ children }) {
    const initialState = {
        friends: [
            {
                info: {
                    id: null,
                    firstName: null,
                    lastName: null,
                    avatarUrl: null,
                    userProfile: null,
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

    const [state, dispatch] = useReducer(ChatReducer, initialState);

    const setFriends = (payload) => {
        dispatch({ type: SET_FRIENDS, payload });
    };

    const setSelectedFriendId = (payload) => {
        dispatch({ type: SET_SELECTED, payload });
    };

    const setChat = (payload) => {
        dispatch({ type: SET_CHAT, payload });
    };

    const setMessage = (payload) => {
        dispatch({ type: SET_MESSAGE, payload });
    };

    const addMessageToChat = (payload) => {
        dispatch({ type: ADD_MESSAGE_TO_CHAT, payload });
    };

    useEffect(() => {
        chatHubService.startConnection();

        chatHubService.onReceiveMessage((message) => {
            addMessageToChat(message);
        });

        return () => chatHubService.stopConnection();
    }, []);

    return (
        <ChatContext.Provider
            value={{
                friends: state.friends,
                selectedFriendId: state.selectedFriendId,
                setFriends,
                setChat,
                setSelectedFriendId,
                setMessage,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}

export default ChatProvider;
