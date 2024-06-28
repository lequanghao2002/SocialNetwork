import { createContext, useState } from 'react';

const AppContext = createContext();

function AppProvider({ children }) {
    const [isPostModalVisible, setIsPostModalVisible] = useState(false);
    const [postCurrent, setPostCurrent] = useState([]);
    const [posts, setPosts] = useState([]);
    // mode: create, update
    const [modePost, setModePost] = useState('');

    return (
        <AppContext.Provider
            value={{
                isPostModalVisible,
                setIsPostModalVisible,
                postCurrent,
                setPostCurrent,
                modePost,
                setModePost,
                posts,
                setPosts,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export { AppContext, AppProvider };
