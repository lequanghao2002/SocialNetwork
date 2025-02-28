import { useReducer } from 'react';
import PostContext from './PostContext';
import PostReducer from './PostReducer';
import { SET_POST } from './PostTypes';

function PostState({ children }) {
    const initialState = {
        content: '',
        status: null,
        images: [],
        tags: [],
        sharedPostId: '',
    };

    const [state, dispatch] = useReducer(PostReducer, initialState);

    const setPost = (payload) => {
        dispatch({ type: SET_POST, payload });
    };

    return (
        <PostContext.Provider
            value={{
                ...state,
                setPost,
            }}
        >
            {children}
        </PostContext.Provider>
    );
}

export default PostState;
