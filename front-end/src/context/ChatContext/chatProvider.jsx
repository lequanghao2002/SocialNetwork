import { useContext, useEffect, useReducer, useState } from 'react';
import ChatReducer from './chatReducer';
import ChatContext from './chatContext';
import {
    ADD_MESSAGE_TO_CHAT,
    MARK_MESSAGE_AS_SEEN,
    SET_CHAT,
    SET_FRIENDS,
    SET_MESSAGE,
    SET_SELECTED,
    UPDATE_MESSAGE_IN_CHAT,
} from './chatTypes';
import { chatHubService } from '~/sockets/chatHubService';
import AuthContext from '../AuthContext/authContext';
import userService from '~/services/userService';

function ChatProvider({ children }) {
    const { user } = useContext(AuthContext);

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

    const [state, dispatch] = useReducer(ChatReducer, initialState);

    useEffect(() => {
        chatHubService.startConnection();

        chatHubService.onReceiveMessage((message) => {
            addMessageToChat(message);
        });

        chatHubService.onMessageUpdated((message) => {
            updateMessageInChat(message);
        });

        return () => chatHubService.stopConnection();
    }, []);

    useEffect(() => {
        fetchListFriendship(user.id);
    }, []);

    const fetchListFriendship = async (Id) => {
        try {
            const result = await userService.getListFriendship(Id);
            setFriends(result);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        }
    };

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

    const updateMessageInChat = (payload) => {
        dispatch({ type: UPDATE_MESSAGE_IN_CHAT, payload });
    };

    const markMessageAsSeen = (payload) => {
        dispatch({ type: MARK_MESSAGE_AS_SEEN, payload });
    };

    return (
        <ChatContext.Provider
            value={{
                friends: state.friends,
                selectedFriendId: state.selectedFriendId,
                setFriends,
                setChat,
                setSelectedFriendId,
                setMessage,
                markMessageAsSeen,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}

export default ChatProvider;
