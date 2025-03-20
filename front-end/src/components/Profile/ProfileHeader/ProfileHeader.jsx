import classNames from 'classnames/bind';
import styles from './ProfileHeader.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { loadingProfileSelector, profileSelector } from '~/features/user/userSelector';
import { userSelector } from '~/features/auth/authSelector';
import Button2 from '~/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faUserCheck, faUserPlus, faUserXmark } from '@fortawesome/free-solid-svg-icons';
import { Avatar, Button, Flex, Image, Modal } from 'antd';
import { openModal } from '~/features/modal/modalSlice';
import { useNavigate, useParams } from 'react-router-dom';
import config from '~/config';
import { setSelectedFriendId } from '~/features/chat/chatSlice';
import {
    acceptFriendRequestThunk,
    cancelFriendRequestThunk,
    declineFriendRequestThunk,
    sendFriendRequestThunk,
    sendUnfriendRequestThunk,
} from '~/features/user/userThunk';
import { useMessage } from '~/context/MessageProvider';
import FriendShipStatus from '~/constants/friendshipStatus';

const cx = classNames.bind(styles);

function ProfileHeader() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(userSelector);
    const profile = useSelector(profileSelector);
    const loadings = useSelector(loadingProfileSelector);

    const { error } = useMessage();

    const handleMessageClick = () => {
        dispatch(setSelectedFriendId(profile.id));
        navigate(config.routes.message);
    };

    const handleAddFriend = async () => {
        try {
            await dispatch(sendFriendRequestThunk(profile.id)).unwrap();
        } catch (err) {
            error('Please try again');
        }
    };

    const handleCancelFriend = async () => {
        try {
            await dispatch(cancelFriendRequestThunk(profile.id)).unwrap();
        } catch (err) {
            error('Please try again');
        }
    };

    const handleDeclineFriend = async () => {
        try {
            await dispatch(declineFriendRequestThunk(profile.id)).unwrap();
        } catch (err) {
            error('Please try again');
        }
    };

    const handleAcceptFriend = async () => {
        try {
            await dispatch(acceptFriendRequestThunk(profile.id)).unwrap();
        } catch (err) {
            error('Please try again');
        }
    };

    const handleSendUnfriend = async () => {
        try {
            await dispatch(sendUnfriendRequestThunk(profile.id)).unwrap();
        } catch (err) {
            error('Please try again');
        }
    };

    //console.log({ profile });

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

                {profile.id === user.id ? (
                    <Button2
                        className={cx('edit-info')}
                        onClick={() => dispatch(openModal({ name: 'profileInfo', type: null, data: profile }))}
                    >
                        Edit info
                    </Button2>
                ) : (
                    <div className={cx('action-btn')}>
                        {(!profile.friendShip || profile.friendShip.status === FriendShipStatus.NOT_FRIENDS) && (
                            <Button
                                size="large"
                                type="primary"
                                icon={<FontAwesomeIcon icon={faUserPlus} />}
                                loading={loadings['addButton']}
                                onClick={handleAddFriend}
                            >
                                Add friend
                            </Button>
                        )}

                        {profile?.friendShip?.status === FriendShipStatus.PENDING_REQUEST &&
                            (user.id === profile.friendShip.requesterId ? (
                                <Button
                                    size="large"
                                    icon={<FontAwesomeIcon icon={faUserXmark} />}
                                    loading={loadings['cancelButton']}
                                    onClick={handleCancelFriend}
                                >
                                    Cancel request
                                </Button>
                            ) : (
                                <Flex gap={12}>
                                    <Button
                                        size="large"
                                        type="primary"
                                        icon={<FontAwesomeIcon icon={faUserPlus} />}
                                        loading={loadings['acceptButton']}
                                        onClick={handleAcceptFriend}
                                        disabled={loadings['cancelButton']}
                                    >
                                        Accept Request
                                    </Button>

                                    <Button
                                        size="large"
                                        icon={<FontAwesomeIcon icon={faUserXmark} />}
                                        loading={loadings['cancelButton']}
                                        onClick={handleDeclineFriend}
                                        disabled={loadings['acceptButton']}
                                    >
                                        Decline Request
                                    </Button>
                                </Flex>
                            ))}

                        {profile?.friendShip?.status === FriendShipStatus.FRIENDS && (
                            <Flex gap={12}>
                                <Button
                                    size="large"
                                    icon={<FontAwesomeIcon icon={faUserXmark} />}
                                    onClick={() => {
                                        Modal.confirm({
                                            title: `Unfriend ${profile.firstName} ${profile.lastName}`,
                                            content: `Are you sure you want to unfriend ${profile.firstName} ${profile.lastName}?`,
                                            className: 'custom-dark-modal',
                                            okText: 'Yes',
                                            cancelText: 'Cancel',
                                            onOk: () => handleSendUnfriend(),
                                        });
                                    }}
                                >
                                    Unfriend
                                </Button>

                                <Button
                                    size="large"
                                    type="primary"
                                    icon={<FontAwesomeIcon icon={faCommentDots} />}
                                    onClick={handleMessageClick}
                                >
                                    Message
                                </Button>
                            </Flex>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

export default ProfileHeader;
