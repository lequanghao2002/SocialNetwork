import React, { useContext } from 'react';
import classNames from 'classnames/bind';
import styles from './UserInfo.module.scss';
import Image from '~/components/Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faPenToSquare, faVideo } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '~/context';

const cx = classNames.bind(styles);

function UserInfo() {
    const { user } = useContext(AuthContext);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('user-info')}>
                <Image src={user.AvatarUrl} alt={user.email} />
                <h2>{`${user.FirstName} ${user.LastName}`}</h2>
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
