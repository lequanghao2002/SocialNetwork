import React from 'react';
import classNames from 'classnames/bind';
import styles from './Login.module.scss';
import { Col, Row, Form, Input } from 'antd';
import Button from '~/components/Button';
import { auth, facebookProvider } from '~/firebase/config';
import { signInWithPopup } from 'firebase/auth';
import * as accountService from '~/services/accountService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {} from '@fortawesome/free-solid-svg-icons';
import { faFacebookSquare, faGoogle } from '@fortawesome/free-brands-svg-icons';

const cx = classNames.bind(styles);

function Login() {
    const handleFbLogin = async () => {
        const response = await signInWithPopup(auth, facebookProvider);
        const user = response.user;

        const userData = {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            firstName: user.displayName.split(' ')[0],
            lastName: user.displayName.split(' ').slice(1).join(' '),
        };

        console.log(userData);

        try {
            const result = await accountService.externalLogin(userData);
            if (result) {
                console.log(result);
            } else {
                console.error('Invalid data format:', result);
            }
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        }
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
                            <Button primary className={cx('facebook-btn')} onClick={handleFbLogin}>
                                <FontAwesomeIcon icon={faFacebookSquare} />
                                Log in with Facebook
                            </Button>
                            <Button className={cx('google-btn')}>
                                <FontAwesomeIcon icon={faGoogle} />
                                Log in with Google
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default Login;
