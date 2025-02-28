import { SET_POST } from './PostTypes';

function PostReducer(state, action) {
    switch (action.type) {
        case SET_POST:
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
}

export default PostReducer;
