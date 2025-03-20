import classNames from 'classnames/bind';
import styles from './ProfileFriends.module.scss';
import { useSelector } from 'react-redux';
import { profileSelector } from '~/features/user/userSelector';
import EllipsisText from '~/components/Text/EllipsisText/EllipsisText';
import config from '~/config';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function ProfileFriends() {
    const navigate = useNavigate();
    const profile = useSelector(profileSelector);

    return (
        <div className={cx('friends')}>
            <h2>Friends</h2>
            <p className={cx('')}>{`${profile.friends.length || 0} friends`}</p>

            <div className={cx('list-friends')}>
                {profile.friends.length >= 0 &&
                    profile.friends.map((item) => (
                        <div
                            key={item.id}
                            className={cx('item-friends')}
                            onClick={() => navigate(config.routes.profile.replace(':id', item.id))}
                        >
                            <img className={cx('img-friend')} src={item.avatarUrl} alt={item.email} />

                            <EllipsisText>
                                <span>{`${item.firstName} ${item.lastName}`}</span>
                            </EllipsisText>
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default ProfileFriends;
