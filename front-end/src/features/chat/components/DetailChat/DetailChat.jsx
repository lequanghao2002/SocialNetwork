import React, { useContext, useMemo } from 'react';
import classNames from 'classnames/bind';
import styles from './DetailChat.module.scss';
import Image from '../../../../components/Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faDownload } from '@fortawesome/free-solid-svg-icons';
import Button from '../../../../components/Button';
import { friendsSelector, selectedFriendIdSelector } from '../../chatSelectors';
import { useSelector } from 'react-redux';
import { userSelector } from '~/features/auth/authSelector';

const cx = classNames.bind(styles);

function DetailChat() {
    const friends = useSelector(friendsSelector);
    const selectedFriendId = useSelector(selectedFriendIdSelector);
    const user = useSelector(userSelector);

    //------------- Để tạm thời, mình sẽ hard code giá trị cho các biến này ------------\
    const isReceiverBlocked = false;
    const isCurrentUserBlocked = false;
    //-------------

    const selectedFriend = useMemo(() => {
        if (!Array.isArray(friends) || !selectedFriendId) return null;
        return friends.find((friend) => friend.info.id === selectedFriendId);
    }, [friends, selectedFriendId]);

    const handleBlock = async () => {};

    return (
        selectedFriend && (
            <div className={cx('wrapper')}>
                <div className={cx('user')}>
                    <Image src={selectedFriend.avatarUrl} alt="" className={cx('img')} />
                    <h2>
                        {selectedFriend.firstName} {selectedFriend.lastName}
                    </h2>
                    {/* <p>Logakfjksdjfksdjfksdjfksdjfksjdfksjdkfjsdkfjdsk</p> */}
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
                                    <img className={cx('photo-img')} src={user?.avatar} alt="" />
                                    <span>photo.jpg</span>
                                </div>
                                <FontAwesomeIcon icon={faDownload} />
                            </div>
                            {/* <div className={cx('photo-item')}>
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
                    </div> */}
                        </div>
                    </div>
                    <div className={cx('option')}>
                        <div className={cx('title')}>
                            <span>Shared files</span>
                            <FontAwesomeIcon icon={faAngleDown} />
                        </div>
                    </div>

                    <Button onClick={handleBlock}>
                        {isCurrentUserBlocked ? 'You are blocked!' : isReceiverBlocked ? 'User blocked' : 'Block User '}
                    </Button>
                </div>
            </div>
        )
    );
}

export default DetailChat;
