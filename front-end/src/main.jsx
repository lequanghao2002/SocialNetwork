import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '~/App';
import GlobalStyles from '~/components/GlobalStyles';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ConfigProvider, theme } from 'antd';

createRoot(document.getElementById('root')).render(
    // <StrictMode>
    <GlobalStyles>
        <GoogleOAuthProvider clientId="938372474737-9qrdlj8jurm1c1j3dpaasptv4stu27e5.apps.googleusercontent.com">
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#f18404', // Màu chính
                    },
                    algorithm: theme.darkAlgorithm,
                }}
            >
                <App />
            </ConfigProvider>
        </GoogleOAuthProvider>
    </GlobalStyles>,
    //</StrictMode>,
);
