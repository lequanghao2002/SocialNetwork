import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { privateRoutes, publicRoutes } from '~/routes';
import { DefaultLayout } from '~/layouts';
import { Fragment, useContext, useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './features/store';
import { fetchFriendsThunk } from './features/chat/chatThunks';
import { chatHubService } from './sockets/chatHubService';
import { addMessageToChat, updateMessageInChat } from './features/chat/chatSlice';
import { loadingSelector, userSelector } from './features/auth/authSelector';
import { fetchUserThunk } from './features/auth/authThunk';
import { Spin } from 'antd';
import config from './config';
import Modals from './components/Modals/Modals';
import NotificationProvider from './context/notification';

function RenderRoutes({ routes }) {
    return (
        <Routes>
            {routes.map(({ path, component: Component, layout }, index) => {
                const Layout = layout ? layout : layout === null ? Fragment : DefaultLayout;
                return (
                    <Route
                        key={index}
                        path={path}
                        element={
                            <Layout>
                                <Component />
                            </Layout>
                        }
                    />
                );
            })}
        </Routes>
    );
}

function AppContent() {
    const dispatch = useDispatch();
    const user = useSelector(userSelector);
    const loading = useSelector(loadingSelector);
    const location = useLocation();
    const navigate = useNavigate();

    // Gọi fetchUserThunk() chỉ khi app khởi động
    useEffect(() => {
        dispatch(fetchUserThunk());
    }, [dispatch]);

    useEffect(() => {
        if (!user) return;

        dispatch(fetchFriendsThunk(user.id));
    }, [user, dispatch]);

    // Xử lý điều hướng
    useEffect(() => {
        if (loading) return;

        const isOnLoginPage = location.pathname === config.routes.login;
        const isValidRoute = Object.values(config.routes).includes(location.pathname);

        if (!user) {
            !isOnLoginPage && navigate(config.routes.login);
        } else {
            if (isOnLoginPage || !isValidRoute) {
                navigate(config.routes.home);
            }
        }
    }, [user, location.pathname, loading, navigate]);

    if (loading) return <Spin size="large" />;

    return <RenderRoutes routes={user ? privateRoutes : publicRoutes} />;
}

function App() {
    return (
        <NotificationProvider>
            <Provider store={store}>
                <Router>
                    <Modals />
                    <AppContent />
                </Router>
            </Provider>
        </NotificationProvider>
    );
}

export default App;
