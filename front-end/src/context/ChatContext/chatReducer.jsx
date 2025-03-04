import {
    ADD_LAST_MESSAGE_TO_USER,
    ADD_MESSAGE_TO_CHAT,
    MARK_MESSAGE_AS_SEEN,
    SET_CHAT,
    SET_FRIENDS,
    SET_MESSAGE,
    SET_SELECTED,
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
            const { type, message } = action.payload;

            // Type = 'sent' => Mình gửi
            // Type = 'received' => Bạn bè gửi
            const id = type === 'sent' ? message.receiverId : message.senderId;
            const friend = state.friends.find((friend) => friend.info.id === id);

            // Cập nhật lại tin nhắn
            const updatedFriend = {
                ...friend,
                info: {
                    ...friend.info,
                    lastMessage: message,
                },
                chat: [...friend.chat, message],
            };

            return {
                ...state,
                friends: [updatedFriend, ...state.friends.filter((f) => f.info.id !== id)],
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
