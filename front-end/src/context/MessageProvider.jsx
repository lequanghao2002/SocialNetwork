import React, { createContext, useContext } from 'react';
import { message, notification } from 'antd';

const MessageContext = createContext(null);

function MessageProvider({ children }) {
    const [messageApi, contextHolder] = message.useMessage();

    const success = (content, duration = 3) =>
        messageApi.success({
            content,
            duration,
        });

    const error = (content, duration = 3) =>
        messageApi.error({
            content,
            duration,
        });

    const info = (content, duration = 3) =>
        messageApi.info({
            content,
            duration,
        });

    const warning = (content, duration = 3) =>
        messageApi.warning({
            content,
            duration,
        });

    return (
        <MessageContext.Provider value={{ success, error, info, warning }}>
            {contextHolder}
            {children}
        </MessageContext.Provider>
    );
}

export const useMessage = () => useContext(MessageContext);
export default MessageProvider;
