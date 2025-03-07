import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { privateRoutes, publicRoutes } from '~/routes';
import { DefaultLayout } from '~/layouts';
import { Fragment, useContext, useEffect } from 'react';
import AuthContext from './context/AuthContext/authContext';
import AuthProvider from './context/AuthContext/authProvider';
import { Provider, useDispatch } from 'react-redux';
import store from './features/store';
import { fetchFriendsThunk } from './features/chat/chatThunks';
import { chatHubService } from './sockets/chatHubService';
import { addMessageToChat, updateMessageInChat } from './features/chat/chatSlice';

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
    const { user } = useContext(AuthContext);
    const dispatch = useDispatch();

    useEffect(() => {
        chatHubService.startConnection();

        chatHubService.onReceiveMessage((message) => {
            dispatch(addMessageToChat(message));
        });

        chatHubService.onMessageUpdated((message) => {
            dispatch(updateMessageInChat(message));
        });

        return () => chatHubService.stopConnection();
    }, []);

    useEffect(() => {
        if (user) {
            dispatch(fetchFriendsThunk(user.id));
        }
    }, [user]);

    return user ? <RenderRoutes routes={privateRoutes} /> : <RenderRoutes routes={publicRoutes} />;
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <Provider store={store}>
                    <AppContent />
                </Provider>
            </AuthProvider>
        </Router>
    );
}

export default App;
