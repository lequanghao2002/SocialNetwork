import { useEffect, useReducer, useState } from 'react';
import AuthContext from './authContext';
import AuthReducer from './authReducer';
import { SET_FRIENDS, SET_USER } from './authTypes';
import { Spin } from 'antd';
import config from '~/config';
import { getLocalStorage } from '~/utils/localStorage';
import { jwtDecode } from 'jwt-decode';
import { useLocation, useNavigate } from 'react-router-dom';
import authService from '~/services/authService';

function AuthProvider({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const initialState = {
        user: null,
        // user: {
        //     id: '',
        //     email: '',
        //     firstName: '',
        //     lastName: '',
        //     avatarUrl: '',
        //     dateOfBirth: '',
        //     createDate: '',
        // },
    };

    const [state, dispatch] = useReducer(AuthReducer, initialState);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = getLocalStorage('token');

            if (token && !state.user) {
                try {
                    const user = await authService.me();
                    dispatch({ type: SET_USER, payload: user });
                } catch (error) {
                    console.error('Lỗi khi lấy thông tin user:', error);
                }
            }

            setLoading(false);
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const isOnLoginPage = location.pathname === config.routes.login;

        if (!state.user && !isOnLoginPage) {
            navigate(config.routes.login);
        } else if (state.user && isOnLoginPage) {
            navigate(config.routes.home);
        }
    }, [state.user]);

    const setUser = (payload) => {
        dispatch({ type: SET_USER, payload });
    };

    if (loading) {
        return <Spin size="large" />;
    }

    return (
        <AuthContext.Provider value={{ user: state.user, friends: state.friends, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
