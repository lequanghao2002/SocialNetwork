import React from 'react';
import classNames from 'classnames/bind';
import styles from './UserInfo.module.scss';
import Image from '~/components/Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faPenToSquare, faVideo } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function UserInfo() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('user-info')}>
                <Image src="123" alt="quanghao" />
                <h2>Quang Hào</h2>
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
