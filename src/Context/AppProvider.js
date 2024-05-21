import { createContext, useState } from 'react';

const AppContext = createContext();

function AppProvider({ children }) {
    const [isPostModalVisible, setIsPostModalVisible] = useState(false);

    return <AppContext.Provider value={{ isPostModalVisible, setIsPostModalVisible }}>{children}</AppContext.Provider>;
}

export { AppContext, AppProvider };
