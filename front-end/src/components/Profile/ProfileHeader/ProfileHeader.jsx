import classNames from 'classnames/bind';
import styles from './ProfileHeader.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { profileSelector } from '~/features/user/userSelector';
import { userSelector } from '~/features/auth/authSelector';
import Button from '~/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBriefcase,
    faCommentDots,
    faHouse,
    faSchool,
    faUserCheck,
    faUserPlus,
    faUserXmark,
} from '@fortawesome/free-solid-svg-icons';
import { Avatar, Image } from 'antd';
import { openModal } from '~/features/modal/modalSlice';

const cx = classNames.bind(styles);

function ProfileHeader() {
    const dispatch = useDispatch();
    const user = useSelector(userSelector);
    const profile = useSelector(profileSelector);
    const friendShip = '';

    console.log(profile);
    return (
        <>
            <div className={cx('cover-image')}>
                {profile.userProfile?.coverPhotoUrl && (
                    <Image height={350} width="100%" src={profile.userProfile?.coverPhotoUrl} alt="" />
                    // <img className={cx('image')} src={profile.userProfile?.coverPhotoUrl} alt="" />
                )}
            </div>
            <div className={cx('header')}>
                <Avatar size={170} src={profile.avatarUrl} alt="" style={{ fontSize: '64px', fontWeight: 'bold' }}>
                    {profile.firstName?.charAt(0)}
                </Avatar>
                <div className={cx('info')}>
                    <span className={cx('full-name')}>{`${profile.firstName} ${profile.lastName}`}</span>
                    <span className={cx('num-friends')}>{`${profile.friends.length || 0} friends`}</span>
                </div>

                {profile.id === user.id && (
                    <Button
                        className={cx('edit-info')}
                        onClick={() => dispatch(openModal({ name: 'profileInfo', type: null, data: profile }))}
                    >
                        Edit info
                    </Button>
                )}

                {profile.id !== user.id && (
                    <div className={cx('action-btn')}>
                        {friendShip.status === 0 && (
                            <Button
                                primary
                                leftIcon={<FontAwesomeIcon icon={faUserPlus} />}
                                onClick={() => handleChangeStatusFriend(1)}
                            >
                                Add friend
                            </Button>
                        )}

                        {friendShip.status === 1 &&
                            (friendShip.userId === user.Id ? (
                                <Button
                                    primary
                                    leftIcon={<FontAwesomeIcon icon={faUserXmark} />}
                                    onClick={() => handleChangeStatusFriend(0)}
                                >
                                    Cancel request
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        primary
                                        leftIcon={<FontAwesomeIcon icon={faUserXmark} />}
                                        onClick={() => handleChangeStatusFriend(2)}
                                    >
                                        Confirm request
                                    </Button>
                                    <Button
                                        leftIcon={<FontAwesomeIcon icon={faUserXmark} />}
                                        onClick={() => handleChangeStatusFriend(0)}
                                    >
                                        Delete request
                                    </Button>
                                </>
                            ))}

                        {friendShip.status === 2 && (
                            <>
                                {/* <Button primary leftIcon={<FontAwesomeIcon icon={faUserCheck} />}>
                                            Friend
                                        </Button> */}
                                <Button
                                    leftIcon={<FontAwesomeIcon icon={faUserCheck} />}
                                    onClick={() => handleChangeStatusFriend(0)}
                                >
                                    Unfriend
                                </Button>
                                <Button primary leftIcon={<FontAwesomeIcon icon={faCommentDots} />}>
                                    Message
                                </Button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

export default ProfileHeader;
