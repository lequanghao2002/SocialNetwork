import { useEffect, useReducer, useState } from 'react';
import AuthContext from './authContext';
import AuthReducer from './authReducer';
import { SET_USER } from './authTypes';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import config from '~/config';
import { getLocalStorage } from '~/utils/localStorage';
import { jwtDecode } from 'jwt-decode';

function AuthProvider({ children }) {
    const initialState = {
        id: '',
        email: '',
        firstName: '',
        lastName: '',
        avatarUrl: '',
        dateOfBirth: '',
        createDate: '',
    };

    const [state, dispatch] = useReducer(AuthReducer, initialState);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = getLocalStorage('token');
        if (token) {
            const user = jwtDecode(token);
            setUser(user);
            setLoading(false);

            navigate(config.routes.home);
        } else {
            setLoading(false);

            navigate(config.routes.login);
        }
    }, []);

    const setUser = (payload) => {
        dispatch({ type: SET_USER, payload });
    };

    return (
        <AuthContext.Provider value={{ user: state, setUser }}>{loading ? <Spin /> : children}</AuthContext.Provider>
    );
}

export default AuthProvider;
