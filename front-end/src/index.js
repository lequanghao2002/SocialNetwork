import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '~/App';
import reportWebVitals from './reportWebVitals';
import GlobalStyles from '~/components/GlobalStyles';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AppProvider } from './context/AppProvider';
import { NotificationProvider } from './context/Notification';
import AuthProvider from './context/AuthContext/authProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    //<React.StrictMode>
    <GlobalStyles>
        <GoogleOAuthProvider clientId="938372474737-9qrdlj8jurm1c1j3dpaasptv4stu27e5.apps.googleusercontent.com">
            <AppProvider>
                <NotificationProvider>
                    <App />
                </NotificationProvider>
            </AppProvider>
        </GoogleOAuthProvider>
    </GlobalStyles>,
    //</React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
