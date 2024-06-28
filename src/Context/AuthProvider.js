import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
import { Spin } from 'antd';
import { jwtDecode } from 'jwt-decode';
import { auth } from '~/firebase/config';

const AuthContext = createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const userToken = localStorage.getItem('userToken');
        if (userToken) {
            const decodedUser = jwtDecode(userToken);
            setUser(decodedUser);
            setIsLoading(false);
            navigate(config.routes.home);
        } else {
            setIsLoading(false);
            navigate(config.routes.login);
        }
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                const userToken = localStorage.getItem('userToken');
                try {
                    if (userToken || userToken != null) {
                        const decodedUser = jwtDecode(userToken);
                        setUser(decodedUser);
                        setIsLoading(false);
                        navigate(config.routes.home);
                    } else {
                        setIsLoading(false);
                        navigate(config.routes.login);
                    }
                } catch (error) {
                    console.error('Invalid token:', error);
                    setIsLoading(false);
                    navigate(config.routes.login);
                }
            } else {
                setIsLoading(false);
                navigate(config.routes.login);
            }
        });

        return () => unsubscribe();
    }, []);

    return <AuthContext.Provider value={{ user, setUser }}>{isLoading ? <Spin /> : children}</AuthContext.Provider>;
}

export { AuthProvider, AuthContext };
