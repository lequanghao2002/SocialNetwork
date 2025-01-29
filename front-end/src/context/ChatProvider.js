import { createContext, useContext, useState } from 'react';
import { AuthContext } from './AuthProvider';

const ChatContext = createContext();

function ChatProvider({ children }) {
    const [chatId, setChatId] = useState(null);
    const [user, setUser] = useState(null);
    const [isCurrentUserBlocked, setIsCurrentUserBlocked] = useState(false);
    const [isReceiverBlocked, setIsReceiverBlocked] = useState(false);

    const { user: currentUser } = useContext(AuthContext);

    const changeChat = (chatId, user) => {
        if (user?.blocked?.includes(currentUser.Uid)) {
            setChatId(chatId);
            setUser(null);
            setIsCurrentUserBlocked(true);
            setIsReceiverBlocked(false);

            return;
        }

        if (currentUser?.blocked?.includes(user.id)) {
            setChatId(chatId);
            setUser(user);
            setIsCurrentUserBlocked(false);
            setIsReceiverBlocked(true);

            return;
        }

        setChatId(chatId);
        setUser(user);
        setIsCurrentUserBlocked(false);
        setIsReceiverBlocked(false);
    };

    const changeBlock = () => {
        setIsReceiverBlocked((prev) => !prev);
    };

    return (
        <ChatContext.Provider
            value={{ user, chatId, isReceiverBlocked, isCurrentUserBlocked, changeChat, changeBlock }}
        >
            {children}
        </ChatContext.Provider>
    );
}

export { ChatContext, ChatProvider };
