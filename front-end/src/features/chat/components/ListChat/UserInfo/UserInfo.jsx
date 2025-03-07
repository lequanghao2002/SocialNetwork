import React from 'react';
import classNames from 'classnames/bind';
import styles from './UserInfo.module.scss';
import Image from '~/components/Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faPenToSquare, faVideo } from '@fortawesome/free-solid-svg-icons';
import { userSelector } from '~/features/auth/authSelector';
import { useSelector } from 'react-redux';
const cx = classNames.bind(styles);

function UserInfo() {
    const user = useSelector(userSelector);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('user-info')}>
                <Image src={user.avatarUrl} alt={user.email} />
                <h2>{`${user.firstName} ${user.lastName}`}</h2>
            </div>

            <div className={cx('icons')}>
                <FontAwesomeIcon icon={faEllipsis} />
                <FontAwesomeIcon icon={faVideo} />
                <FontAwesomeIcon icon={faPenToSquare} />
            </div>
        </div>
    );
}

export default UserInfo;
