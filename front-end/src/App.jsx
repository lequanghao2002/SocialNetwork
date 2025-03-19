import {
    BrowserRouter as Router,
    Routes,
    Route,
    useNavigate,
    useLocation,
    matchPath,
    useParams,
} from 'react-router-dom';
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
import { fetchPostsThunk, fetchProfilePostsThunk, fetchSavedPostsThunk } from './features/post/postThunk';
import { resetPosts, setCurrentPage } from './features/post/postSlice';

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
    const user = useSelector(userSelector);
    const loading = useSelector(loadingSelector);
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    console.log({ id });

    useEffect(() => {
        const isProfilePage = matchPath(config.routes.profile, location.pathname);
        if (isProfilePage) {
            dispatch(setCurrentPage(config.routes.profile));
            dispatch(resetPosts());
            dispatch(fetchProfilePostsThunk(isProfilePage.params.id));
        } else {
            switch (location.pathname) {
                case config.routes.home:
                    dispatch(setCurrentPage(config.routes.home));
                    dispatch(resetPosts());
                    dispatch(fetchPostsThunk());
                    break;
                case config.routes.bookmark:
                    dispatch(setCurrentPage(config.routes.bookmark));
                    dispatch(resetPosts());
                    dispatch(fetchSavedPostsThunk());
                    break;
                default:
                    break;
            }
        }
    }, [location.pathname, filter.status]);

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
        const isProfilePage = matchPath(config.routes.profile, location.pathname);
        const isValidRoute = Object.values(config.routes).includes(location.pathname) || isProfilePage;

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
