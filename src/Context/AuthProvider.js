import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
import { auth } from '~/firebase/config';
import { Spin } from 'antd';

const AuthContext = createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscibed = auth.onAuthStateChanged((user) => {
            if (user) {
                const { displayName, email, uid, photoURL } = user;
                setUser({ displayName, email, uid, photoURL });
                setIsLoading(false);
                navigate(config.routes.home);
                return;
            }
            navigate(config.routes.login);
            setIsLoading(false);
        });

        return () => {
            unsubscibed();
        };
    }, []);
    return <AuthContext.Provider value={{ user }}>{isLoading ? <Spin /> : children}</AuthContext.Provider>;
}

export { AuthProvider, AuthContext };
