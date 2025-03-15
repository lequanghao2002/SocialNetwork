import { notification } from 'antd';
import { createContext, useContext } from 'react';

const NotificationContext = createContext();

function NotificationProvider({ children }) {
    const [notificationApi, contextHolder] = notification.useNotification();

    const success = (message, description, placement = 'topRight', duration = 4.5) =>
        notificationApi.success({
            message,
            description,
            placement,
            duration,
        });

    const error = (message, description, placement = 'topRight', duration = 4.5) =>
        notificationApi.error({
            message,
            description,
            placement,
            duration,
        });

    const info = (message, description, placement = 'topRight', duration = 4.5) =>
        notificationApi.info({
            message,
            description,
            placement,
            duration,
        });

    const warning = (message, description, placement = 'topRight', duration = 4.5) =>
        notificationApi.warning({
            message,
            description,
            placement,
            duration,
        });

    return (
        <NotificationContext.Provider value={{ success, error, info, warning }}>
            {contextHolder}
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotification = () => useContext(NotificationContext);
export default NotificationProvider;
