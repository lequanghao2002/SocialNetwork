import {
    ADD_MESSAGE_TO_CHAT,
    MARK_MESSAGE_AS_SEEN,
    SET_CHAT,
    SET_FRIENDS,
    SET_MESSAGE,
    SET_SELECTED,
    UPDATE_MESSAGE_IN_CHAT,
} from './chatTypes';

function ChatReducer(state, action) {
    console.log('state', state);
    console.log('action', action);

    switch (action.type) {
        case SET_FRIENDS:
            return {
                ...state,
                friends: action.payload.map((friend) => ({
                    info: friend,
                    message: {
                        content: '',
                        imageUrl: '',
                    },
                    chat: [],
                })),
                selectedFriendId: action.payload[0].id,
            };
        case SET_SELECTED:
            return {
                ...state,
                selectedFriendId: action.payload,
            };
        case SET_MESSAGE:
            return {
                ...state,
                friends: state.friends.map((friend) =>
                    friend.info.id === state.selectedFriendId
                        ? {
                              ...friend,
                              message: action.payload,
                          }
                        : friend,
                ),
            };
        case SET_CHAT:
            return {
                ...state,
                friends: state.friends.map((friend) =>
                    friend.info.id === state.selectedFriendId
                        ? {
                              ...friend,
                              chat: action.payload,
                          }
                        : friend,
                ),
            };
        case ADD_MESSAGE_TO_CHAT:
            const friend = state.friends.find(
                (friend) => friend.info.id === action.payload.senderId || friend.info.id === action.payload.receiverId,
            );

            // Cập nhật lại tin nhắn
            const updatedFriend = {
                ...friend,
                info: {
                    ...friend.info,
                    lastMessage: action.payload,
                },
                chat: [...friend.chat, action.payload],
            };

            return {
                ...state,
                friends: [updatedFriend, ...state.friends.filter((f) => f.info.id !== friend.info.id)],
            };
        case UPDATE_MESSAGE_IN_CHAT:
            return {
                ...state,
                friends: state.friends.map((friend) => {
                    if (friend.info.id === action.payload.senderId || friend.info.id === action.payload.receiverId) {
                        return {
                            ...friend,
                            chat: friend.chat.map((msg) => (msg.id === action.payload.id ? action.payload : msg)),
                        };
                    }
                    return friend;
                }),
            };
        case MARK_MESSAGE_AS_SEEN:
            return {
                ...state,
                friends: state.friends.map((friend) =>
                    friend.info.id === state.selectedFriendId
                        ? {
                              ...friend,
                              info: {
                                  ...friend.info,
                                  lastMessage: {
                                      ...friend.info.lastMessage,
                                      isSeen: action.payload,
                                  },
                              },
                          }
                        : friend,
                ),
            };

        default:
            return state;
    }
}

export default ChatReducer;
