import { ADD_MESSAGE_TO_CHAT, SET_CHAT, SET_FRIENDS, SET_MESSAGE, SET_SELECTED } from './chatTypes';

function ChatReducer(state, action) {
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

            let id = type === 'sent' ? message.receiverId : message.senderId;

            return {
                ...state,
                friends: state.friends.map((friend) =>
                    friend.info.id === id
                        ? {
                              ...friend,
                              chat: [...friend.chat, message],
                          }
                        : friend,
                ),
            };

        default:
            return state;
    }
}

export default ChatReducer;
