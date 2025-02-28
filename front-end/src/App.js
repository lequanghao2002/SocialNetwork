import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from '~/routes';
import { DefaultLayout } from '~/layouts';
import { Fragment } from 'react';
import { ChatProvider } from './context/ChatProvider';
import AuthProvider from './context/AuthContext/authProvider';

function App() {
    return (
        <Router>
            <div className="App">
                {/* <ChatProvider>
                   
                </ChatProvider> */}

                <AuthProvider>
                    <Routes>
                        {publicRoutes.map((route, index) => {
                            const Page = route.component;

                            let Layout = DefaultLayout;
                            if (route.layout) {
                                Layout = route.layout;
                            } else if (route.layout === null) {
                                Layout = Fragment;
                            }

                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    }
                                />
                            );
                        })}
                    </Routes>
                </AuthProvider>
            </div>
        </Router>
    );
}

export default App;
