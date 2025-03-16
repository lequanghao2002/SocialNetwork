import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { privateRoutes, publicRoutes } from '~/routes';
import { DefaultLayout } from '~/layouts';
import { Fragment, useContext, useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './features/store';
import { fetchFriendsThunk } from './features/chat/chatThunks';
import { loadingSelector, userSelector } from './features/auth/authSelector';
import { fetchUserThunk } from './features/auth/authThunk';
import { Spin } from 'antd';
import config from './config';
import Modals from './components/Modals/Modals';
import NotificationProvider from './context/NotificationProvider';
import { realtimeHubService } from './sockets/realtimeHubService';
import MessageProvider from './context/MessageProvider';
import { filterSelector, pagingSelector } from './features/post/postSelector';
import { fetchPostsThunk } from './features/post/postThunk';

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
    const filter = useSelector(filterSelector);
    const paging = useSelector(pagingSelector);
    const user = useSelector(userSelector);
    const loading = useSelector(loadingSelector);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchPostsThunk({ filter, paging }));
    }, [filter.status]);

    // Gọi fetchUserThunk() chỉ khi app khởi động
    useEffect(() => {
        dispatch(fetchUserThunk());
    }, []);

    useEffect(() => {
        if (!user) {
            realtimeHubService.stopConnection();
            return;
        }

        realtimeHubService.startConnection();
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

    if (loading) return <Spin size="large" fullscreen />;

    return <RenderRoutes routes={user ? privateRoutes : publicRoutes} />;
}

function App() {
    return (
        <NotificationProvider>
            <MessageProvider>
                <Provider store={store}>
                    <Router>
                        <Modals />
                        <AppContent />
                    </Router>
                </Provider>
            </MessageProvider>
        </NotificationProvider>
    );
}

export default App;
