import React from 'react';
import classNames from 'classnames/bind';
import styles from './DetailChat.module.scss';
import Image from '../Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faDownload } from '@fortawesome/free-solid-svg-icons';
import Button from '../Button';

const cx = classNames.bind(styles);

function DetailChat() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('user')}>
                <Image src="" alt="" className={cx('img')} />
                <h2>Quang Hào</h2>
                <p>Logakfjksdjfksdjfksdjfksdjfksjdfksjdkfjsdkfjdsk</p>
            </div>

            <div className={cx('info')}>
                <div className={cx('option')}>
                    <div className={cx('title')}>
                        <span>Chat Settings</span>
                        <FontAwesomeIcon icon={faAngleUp} />
                    </div>
                </div>
                <div className={cx('option')}>
                    <div className={cx('title')}>
                        <span>Privacy & help</span>
                        <FontAwesomeIcon icon={faAngleUp} />
                    </div>
                </div>
                <div className={cx('option')}>
                    <div className={cx('title')}>
                        <span>Shared photos</span>
                        <FontAwesomeIcon icon={faAngleDown} />
                    </div>
                    <div className={cx('photos')}>
                        <div className={cx('photo-item')}>
                            <div className={cx('photo-detail')}>
                                <img
                                    className={cx('photo-img')}
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbKKq80PgBVyLpEBhwgkzg77u9jihRZINHiQ&s"
                                    alt=""
                                />
                                <span>photo.jpg</span>
                            </div>
                            <FontAwesomeIcon icon={faDownload} />
                        </div>
                        <div className={cx('photo-item')}>
                            <div className={cx('photo-detail')}>
                                <img
                                    className={cx('photo-img')}
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbKKq80PgBVyLpEBhwgkzg77u9jihRZINHiQ&s"
                                    alt=""
                                />
                                <span>photo.jpg</span>
                            </div>
                            <FontAwesomeIcon icon={faDownload} />
                        </div>
                        <div className={cx('photo-item')}>
                            <div className={cx('photo-detail')}>
                                <img
                                    className={cx('photo-img')}
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbKKq80PgBVyLpEBhwgkzg77u9jihRZINHiQ&s"
                                    alt=""
                                />
                                <span>photo.jpg</span>
                            </div>
                            <FontAwesomeIcon icon={faDownload} />
                        </div>
                    </div>
                </div>
                <div className={cx('option')}>
                    <div className={cx('title')}>
                        <span>Shared files</span>
                        <FontAwesomeIcon icon={faAngleDown} />
                    </div>
                </div>

                <Button>Block User</Button>
            </div>
        </div>
    );
}

export default DetailChat;
