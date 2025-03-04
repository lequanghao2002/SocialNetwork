import { SET_FRIENDS, SET_USER } from './authTypes';

function AuthReducer(state, action) {
    switch (action.type) {
        case SET_USER:
            return { ...state, user: action.payload };
        default:
            return state;
    }
}

export default AuthReducer;
