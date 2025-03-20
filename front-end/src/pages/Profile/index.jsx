import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import { Col, Row, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector } from '~/features/auth/authSelector';
import { loadingProfileSelector, profileSelector } from '~/features/user/userSelector';
import { fetchProfileThunk } from '~/features/user/userThunk';
import ProfileHeader from '~/components/Profile/ProfileHeader/ProfileHeader';
import ProfileInfo from '~/components/Profile/ProfileInfo/ProfileInfo';
import ProfileFriends from '~/components/Profile/ProfileFriends/ProfileFriends';
import PostCreate from '~/components/Post/PostCreate/PostCreate';
import ListPost from '~/components/Post/ListPost/ListPost';
import { setProfile } from '~/features/user/userSlice';

const cx = classNames.bind(styles);

function Profile() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const user = useSelector(userSelector);
    const profile = useSelector(profileSelector);
    const loadings = useSelector(loadingProfileSelector);

    useEffect(() => {
        if (id) {
            dispatch(fetchProfileThunk(id));
        }

        return () => {
            dispatch(setProfile(null));
        };
    }, [id]);

    if (loadings['page']) return <Spin size="large" fullscreen />;

    return (
        <>
            <div className={cx('wrapper')}>
                <div className={cx('profile')}>
                    <ProfileHeader />

                    <Row>
                        <Col span={10}>
                            <ProfileInfo />

                            <ProfileFriends />
                        </Col>

                        <Col span={1}></Col>

                        <Col span={13}>
                            <div className={cx('post')}>
                                {user.id === id && <PostCreate />}

                                <ListPost userId={id} />
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    );
}

export default Profile;
