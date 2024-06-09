import classNames from 'classnames/bind';
import styles from './AccountPreview.module.scss';
import Button from '~/components/Button';
import Image from '~/components/Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faUserPlus } from '@fortawesome/free-solid-svg-icons';

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
                    <Button text className={cx('study-at')}>
                        Trường Đại học Yersin Đà Lạt
                    </Button>
                    <Button text className={cx('live-at')}>
                        Ninh Thuận
                    </Button>
                </div>
            </div>

            <div className={cx('body')}>
                <Button leftIcon={<FontAwesomeIcon icon={faCommentDots} />}>Message</Button>
                <Button primary leftIcon={<FontAwesomeIcon icon={faUserPlus} />}>
                    Add friend
                </Button>
            </div>
        </div>
    );
}

export default AccountPreview;
