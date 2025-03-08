import { notification } from 'antd';
import { createContext, useContext } from 'react';

const NotificationContext = createContext();

function NotificationProvider({ children }) {
    const [api, contextHolder] = notification.useNotification();

    /**
     * hàm thông báo
     * @param {string, string}
     * title: tiêu đề
     * position: vị trí hiển thị (topLeft, topRight, bottomLeft, bottomRight)
     */

    const success = (title, position = 'topRight') => {
        api.success({
            placement: position,
            message: title,
        });
    };

    const error = (title, position = 'topRight') => {
        api.error({
            placement: position,
            message: title,
        });
    };

    return (
        <NotificationContext.Provider value={{ success, error }}>
            {contextHolder}
            {children}
        </NotificationContext.Provider>
    );
}

const useNotification = () => {
    const context = useContext(NotificationContext);
    return context;
};

export { useNotification };
export default NotificationProvider;
