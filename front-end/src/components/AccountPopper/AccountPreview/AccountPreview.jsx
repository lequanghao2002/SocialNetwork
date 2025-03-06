import classNames from 'classnames/bind';
import styles from './AccountPreview.module.scss';
import Button from '~/components/Button';
import Image from '~/components/Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faCommentDots, faHouse, faSchool, faUserPlus } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function AccountPreview({ user }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <Image className={cx('avatar')} src={user.avatarUrl} alt={user.email} />
                <div className={cx('info')}>
                    <Button text className={cx('nickname')}>
                        <strong>{user.firstName + ' ' + user.lastName}</strong>
                    </Button>
                    <div className={cx('info-detail')}>
                        {user?.userProfile?.liveAt && (
                            <span>
                                <FontAwesomeIcon icon={faHouse} className={cx('icon-intro')} />
                                Live at:
                                <Button text className={cx('live-at')}>
                                    {user?.userProfile?.liveAt}
                                </Button>
                            </span>
                        )}

                        {user?.userProfile?.studyAt && (
                            <span>
                                <FontAwesomeIcon icon={faSchool} className={cx('icon-intro')} />
                                Study at:
                                <Button text className={cx('study-at')}>
                                    {user?.userProfile?.studyAt}
                                </Button>
                            </span>
                        )}

                        {user?.userProfile?.workingAt && (
                            <span>
                                <FontAwesomeIcon icon={faBriefcase} className={cx('icon-intro')} />
                                Work at:
                                <Button text className={cx('work-at')}>
                                    {user?.userProfile?.workingAt}
                                </Button>
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* <div className={cx('body')}>
                <Button leftIcon={<FontAwesomeIcon icon={faCommentDots} />}>Message</Button>
                <Button primary leftIcon={<FontAwesomeIcon icon={faUserPlus} />}>
                    Add friend
                </Button>
            </div> */}
        </div>
    );
}

export default AccountPreview;
