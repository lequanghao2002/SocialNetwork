import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '~/App';
import GlobalStyles from '~/components/GlobalStyles';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AppProvider } from './context/AppProvider';
import { NotificationProvider } from './context/Notification';

createRoot(document.getElementById('root')).render(
    // <StrictMode>
    <GlobalStyles>
        <GoogleOAuthProvider clientId="938372474737-9qrdlj8jurm1c1j3dpaasptv4stu27e5.apps.googleusercontent.com">
            <AppProvider>
                <NotificationProvider>
                    <App />
                </NotificationProvider>
            </AppProvider>
        </GoogleOAuthProvider>
    </GlobalStyles>,
    //</StrictMode>,
);
