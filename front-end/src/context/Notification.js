import { message } from 'antd';
import { createContext, useState } from 'react';

const NotificationContext = createContext();

function NotificationProvider({ children }) {
    const [messageApi, contextHolder] = message.useMessage();

    const success = (message) => {
        messageApi.open({
            type: 'success',
            content: message,
            style: {},
        });
    };

    const error = (message) => {
        messageApi.open({
            type: 'error',
            content: message,
            style: {},
        });
    };

    return (
        <NotificationContext.Provider value={{ success, error }}>
            {contextHolder}
            {children}
        </NotificationContext.Provider>
    );
}

export { NotificationContext, NotificationProvider };
