import { useEffect, useReducer, useState } from 'react';
import AuthContext from './authContext';
import AuthReducer from './authReducer';
import { SET_FRIENDS, SET_USER } from './authTypes';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import config from '~/config';
import { getLocalStorage } from '~/utils/localStorage';
import { jwtDecode } from 'jwt-decode';

function AuthProvider({ children }) {
    const initialState = {
        user: {
            id: '',
            email: '',
            firstName: '',
            lastName: '',
            avatarUrl: '',
            dateOfBirth: '',
            createDate: '',
        },
    };

    const [state, dispatch] = useReducer(AuthReducer, initialState);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = getLocalStorage('token');
        if (token) {
            const user = jwtDecode(token);
            setUser(user);

            navigate(config.routes.home);
        } else {
            navigate(config.routes.login);
        }

        setLoading(false);
    }, []);

    const setUser = (payload) => {
        dispatch({ type: SET_USER, payload });
        navigate(config.routes.home);
    };

    return (
        <AuthContext.Provider value={{ user: state.user, friends: state.friends, setUser }}>
            {loading ? <Spin /> : children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
