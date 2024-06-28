import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import Image from '~/components/Image';
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
import { Col, Row, message } from 'antd';
import { faLinkedin, faSquareFacebook, faSquareGithub, faUpwork } from '@fortawesome/free-brands-svg-icons';
import Home from '../Home';
import FriendStatusButton from '~/components/FriendStatusButton';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '~/context';
import * as userServices from '~/services/userService';
import { useParams } from 'react-router-dom';
import ProfileModal from '~/components/Modals/ProfileModal';

const cx = classNames.bind(styles);

function Profile() {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [userInfo, setUserInfo] = useState(null);
    const [friendShip, setFriendShip] = useState({});
    const [listFriendShip, setListFriendShip] = useState({});
    const [showProfileModal, setShowProfileModal] = useState(null);

    useEffect(() => {
        fetchUserProfileById(id);
        fetchListFriendship(id);

        if (id !== user.Id) {
            fetchFriendship(user.Id, id);
        }
    }, [id]);

    const fetchUserProfileById = async (id) => {
        try {
            const result = await userServices.getUserById(id);
            if (result) {
                setUserInfo(result);
            } else {
                console.error('Invalid data format:', result);
            }
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        }
    };

    const fetchListFriendship = async (Id) => {
        try {
            const result = await userServices.getListFriendship(Id);
            setListFriendShip(result);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        }
    };

    const fetchFriendship = async (userId, friendId) => {
        try {
            const result = await userServices.getStatusFriend(userId, friendId);
            setFriendShip(result);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        }
    };

    const onUpdate = () => {
        fetchUserProfileById(id);
    };

    const handleChangeStatusFriend = async (status) => {
        const data = { userId: user.Id, friendId: id, status };
        const result = await userServices.changeStatusFriend(data);

        if (result) {
            fetchFriendship(user.Id, id);
            fetchListFriendship(id);
        }
    };

    return (
        <>
            <div className={cx('wrapper')}>
                <ProfileModal
                    visible={showProfileModal}
                    setVisible={setShowProfileModal}
                    onClose={() => setShowProfileModal(false)}
                    userInfo={userInfo}
                    onUpdate={onUpdate}
                />

                <div className={cx('cover-image')}>
                    {userInfo?.userProfile?.coverPhotoUrl && (
                        <img className={cx('image')} src={userInfo?.userProfile?.coverPhotoUrl} alt="" />
                    )}
                </div>

                <div className={cx('profile')}>
                    <div className={cx('header')}>
                        <Image className={cx('avatar')} src={userInfo?.avatarUrl} />
                        <div className={cx('info')}>
                            <span className={cx('full-name')}>{`${userInfo?.firstName} ${userInfo?.lastName}`}</span>
                            <span className={cx('num-friends')}>{`${listFriendShip?.length} friends`}</span>
                        </div>

                        {userInfo?.id !== user.Id && (
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

                    <div className={cx('body')}>
                        <Row>
                            <Col span={10}>
                                <div className={cx('intro')}>
                                    <div className={cx('your-self')}>
                                        <h2>Intro</h2>
                                        <p className={cx('introduce')}>{userInfo?.userProfile?.introduce}</p>

                                        <div className={cx('info-detail')}>
                                            {userInfo?.userProfile?.liveAt && (
                                                <span>
                                                    <FontAwesomeIcon icon={faHouse} className={cx('icon-intro')} />
                                                    Live at:
                                                    <Button text className={cx('live-at')}>
                                                        {userInfo?.userProfile?.liveAt}
                                                    </Button>
                                                </span>
                                            )}

                                            {userInfo?.userProfile?.studyAt && (
                                                <span>
                                                    <FontAwesomeIcon icon={faSchool} className={cx('icon-intro')} />
                                                    Study at:
                                                    <Button text className={cx('study-at')}>
                                                        {userInfo?.userProfile?.studyAt}
                                                    </Button>
                                                </span>
                                            )}

                                            {userInfo?.userProfile?.workingAt && (
                                                <span>
                                                    <FontAwesomeIcon icon={faBriefcase} className={cx('icon-intro')} />
                                                    Work at:
                                                    <Button text className={cx('work-at')}>
                                                        {userInfo?.userProfile?.workingAt}
                                                    </Button>
                                                </span>
                                            )}

                                            {userInfo?.userProfile?.github && (
                                                <span>
                                                    <FontAwesomeIcon
                                                        icon={faSquareGithub}
                                                        className={cx('icon-intro')}
                                                    />
                                                    Github:
                                                    <Button text className={cx('study-at')}>
                                                        {userInfo?.userProfile?.github}
                                                    </Button>
                                                </span>
                                            )}

                                            {userInfo?.userProfile?.linkedIn && (
                                                <span>
                                                    <FontAwesomeIcon icon={faLinkedin} className={cx('icon-intro')} />
                                                    LinkedIn:
                                                    <Button text className={cx('study-at')}>
                                                        {userInfo?.userProfile?.linkedIn}
                                                    </Button>
                                                </span>
                                            )}

                                            {userInfo?.userProfile?.facebook && (
                                                <span>
                                                    <FontAwesomeIcon
                                                        icon={faSquareFacebook}
                                                        className={cx('icon-intro')}
                                                    />
                                                    Facebook:
                                                    <Button text className={cx('study-at')}>
                                                        {userInfo?.userProfile?.facebook}
                                                    </Button>
                                                </span>
                                            )}
                                        </div>

                                        {userInfo?.id === user.Id && (
                                            <Button small onClick={() => setShowProfileModal(true)}>
                                                Edit details
                                            </Button>
                                        )}
                                    </div>

                                    <div className={cx('friends')}>
                                        <h2>Friends</h2>
                                        <p className={cx('')}>{`${listFriendShip?.length} friends`}</p>

                                        <div className={cx('list-friends')}>
                                            {listFriendShip?.length >= 0 &&
                                                listFriendShip.map((item) => (
                                                    <div className={cx('item-friends')}>
                                                        <img
                                                            key={item.id}
                                                            className={cx('img-friend')}
                                                            src={item.avatarUrl}
                                                            alt={item.email}
                                                        />
                                                        <span>{`${item.firstName} ${item.lastName}`}</span>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </Col>

                            <Col span={14}>
                                <div className={cx('post')}>
                                    <Home profile={true} profileId={id} />
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profile;
