import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { privateRoutes, publicRoutes } from '~/routes';
import { DefaultLayout } from '~/layouts';
import { Fragment, useContext } from 'react';
import ChatProvider from './context/ChatContext/chatProvider';
import AuthContext from './context/AuthContext/authContext';
import AuthProvider from './context/AuthContext/authProvider';
import { Provider } from 'react-redux';
import store from './features/store';

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

    return user ? (
        //<Provider store={store}>
        <ChatProvider>
            <RenderRoutes routes={privateRoutes} />
        </ChatProvider>
    ) : (
        //</Provider>
        <RenderRoutes routes={publicRoutes} />
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
}

export default App;
