import classNames from 'classnames/bind';
import styles from './ProfileInfo.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { profileSelector } from '~/features/user/userSelector';
import { userSelector } from '~/features/auth/authSelector';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faHouse, faSchool } from '@fortawesome/free-solid-svg-icons';
import { faFacebookSquare, faGithubSquare, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { openModal } from '~/features/modal/modalSlice';
import ReadMoreText from '~/components/Text/ReadMoreText/ReadMoreText';
import { Button } from 'antd';

const cx = classNames.bind(styles);

function ProfileInfo() {
    const dispatch = useDispatch();
    const profile = useSelector(profileSelector);
    const user = useSelector(userSelector);

    return (
        <div className={cx('your-self')}>
            <h2>Intro</h2>
            {profile.userProfile?.introduce && (
                <div className={cx('introduce')}>
                    <ReadMoreText text={profile.userProfile.introduce} rows={3} />
                </div>
            )}

            <div className={cx('info-detail')}>
                <div>
                    {profile.userProfile?.liveAt && (
                        <div>
                            <FontAwesomeIcon icon={faHouse} className={cx('icon-intro')} />
                            <span className={cx('label')}>Live at:</span>
                            <Button type="link">{profile.userProfile?.liveAt}</Button>
                        </div>
                    )}

                    {profile.userProfile?.studyAt && (
                        <div>
                            <FontAwesomeIcon icon={faSchool} className={cx('icon-intro')} />
                            <span className={cx('label')}>Study at:</span>
                            <Button type="link" className={cx('study-at')}>
                                {profile.userProfile?.studyAt}
                            </Button>
                        </div>
                    )}

                    {profile.userProfile?.workingAt && (
                        <div>
                            <FontAwesomeIcon icon={faBriefcase} className={cx('icon-intro')} />
                            <span className={cx('label')}>Work at:</span>
                            <Button type="link" className={cx('work-at')}>
                                {profile.userProfile?.workingAt}
                            </Button>
                        </div>
                    )}

                    {profile.userProfile?.github && (
                        <div>
                            <FontAwesomeIcon icon={faGithubSquare} className={cx('icon-intro')} />
                            <span className={cx('label')}>Github: </span>
                            <a href={profile.userProfile.github} target="_blank" rel="noopener noreferrer">
                                <Button type="link" className={cx('github')}>
                                    {profile.userProfile.github}
                                </Button>
                            </a>
                        </div>
                    )}

                    {profile.userProfile?.linkedIn && (
                        <div>
                            <FontAwesomeIcon icon={faLinkedin} className={cx('icon-intro')} />
                            <span className={cx('label')}>LinkedIn: </span>
                            <a href={profile.userProfile.linkedIn} target="_blank" rel="noopener noreferrer">
                                <Button type="link" className={cx('linkedin')}>
                                    {profile.userProfile.linkedIn}
                                </Button>
                            </a>
                        </div>
                    )}

                    {profile.userProfile?.facebook && (
                        <div>
                            <FontAwesomeIcon icon={faFacebookSquare} className={cx('icon-intro')} />
                            <span className={cx('label')}>Facebook:</span>
                            <a href={profile.userProfile.facebook} target="_blank" rel="noopener noreferrer">
                                <Button type="link" className={cx('facebook')}>
                                    {profile.userProfile.facebook}
                                </Button>
                            </a>
                        </div>
                    )}
                </div>

                {profile.id === user.id && (
                    <Button
                        type="default"
                        onClick={() => dispatch(openModal({ name: 'profileDetail', data: profile.userProfile }))}
                    >
                        Edit detail
                    </Button>
                )}
            </div>
        </div>
    );
}

export default ProfileInfo;
