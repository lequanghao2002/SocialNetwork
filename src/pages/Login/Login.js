import React, { useContext } from 'react';
import classNames from 'classnames/bind';
import styles from './Login.module.scss';
import { Col, Row, Form, Input } from 'antd';
import Button from '~/components/Button';
import { signInWithPopup } from 'firebase/auth';
import * as accountService from '~/services/accountService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookSquare, faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from '~/context';
import config from '~/config';
import { useNavigate } from 'react-router-dom';
import { auth, facebookProvider, googleProvider, githubProvider, db } from '~/firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import upload from '~/firebase/upload';

const cx = classNames.bind(styles);

function Login() {
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const fetchLoginExternal = async (user, provider) => {
        const userData = {
            provider: provider,
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            firstName: user.displayName.split(' ')[0],
            lastName: user.displayName.split(' ').slice(1).join(' '),
        };

        //const imgUrl = await upload();

        await setDoc(doc(db, 'users', userData.uid), {
            username: userData.displayName,
            email: userData.email,
            avatar: userData.photoURL,
            id: userData.uid,
            blocked: [],
        });

        await setDoc(doc(db, 'userchats', userData.uid), {
            chat: [],
        });

        try {
            const result = await accountService.externalLogin(userData);
            if (result !== '') {
                localStorage.setItem('userToken', result);
                const decodedToken = jwtDecode(result);
                setUser(decodedToken);
                navigate(config.routes.home);
            } else {
                console.error('Get token user error');
            }
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        }
    };

    const handleFacebookLogin = async () => {
        const response = await signInWithPopup(auth, facebookProvider);
        fetchLoginExternal(response.user, 'Facebook');
    };

    const handleGoogleLogin = async () => {
        const response = await signInWithPopup(auth, googleProvider);
        fetchLoginExternal(response.user, 'Google');
    };

    const handleGithubLogin = async () => {
        const response = await signInWithPopup(auth, githubProvider);
        fetchLoginExternal(response.user, 'Github');
    };

    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className={cx('wrapper')}>
            <Row justify="center">
                <Col span={24}>
                    <div className={cx('login-container')}>
                        <h2 className={cx('title')}>Social Network</h2>
                        <Form
                            name="login"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                        >
                            <Form.Item
                                name="username"
                                rules={[{ required: true, message: 'Please input your username!' }]}
                            >
                                <Input placeholder="Username" className={cx('custom-input')} />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                                <Input.Password placeholder="Password" className={cx('custom-input')} />
                            </Form.Item>

                            <Form.Item>
                                <Button>Login</Button>
                            </Form.Item>
                        </Form>

                        <div className={cx('social-login')}>
                            <Button primary className={cx('facebook-btn')} onClick={handleFacebookLogin}>
                                <FontAwesomeIcon icon={faFacebookSquare} />
                                Log in with Facebook
                            </Button>
                            <Button className={cx('google-btn')} onClick={handleGoogleLogin}>
                                <FontAwesomeIcon icon={faGoogle} />
                                Log in with Google
                            </Button>
                            <Button className={cx('github-btn')} onClick={handleGithubLogin}>
                                <FontAwesomeIcon icon={faGithub} />
                                Log in with GitHub
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default Login;
