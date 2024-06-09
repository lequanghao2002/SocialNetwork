import classNames from 'classnames/bind';
import styles from './AccountPopper.module.scss';
import Tippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import AccountPreview from './AccountPreview';
import Image from '../Image';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';

const cx = classNames.bind(styles);
dayjs.extend(relativeTime);
dayjs.extend(utc);

function AccountPopper({ data }) {
    var user = data.user;

    const timeAgo = dayjs.utc(data.createdDate).local().fromNow();

    const renderPreview = (props) => {
        return (
            <div tabIndex="-1" {...props}>
                <PopperWrapper>
                    <AccountPreview user={data.user} />
                </PopperWrapper>
            </div>
        );
    };

    return (
        <div>
            <Tippy interactive offset={[-150, -30]} delay={[300, 100]} placement="bottom-start" render={renderPreview}>
                <div className={cx('account-item')}>
                    <Image src={user.avatarUrl} alt={user.email} />
                    <div className={cx('item-info')}>
                        <p className={cx('nickname')}>
                            <span>{user.firstName + ' ' + user.lastName}</span>
                        </p>
                        <p className={cx('time')}>
                            <span>{timeAgo}</span>
                        </p>
                    </div>
                </div>
            </Tippy>
        </div>
    );
}

export default AccountPopper;
