import classNames from 'classnames/bind';
import styles from './SuggestedAccounts.module.scss';
import Tippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import AccountPreview from '../AccountPreview';
import Image from '../Image';

const cx = classNames.bind(styles);

function AccountItem({ data }) {
    const renderPreview = (props) => {
        return (
            <div tabIndex="-1" {...props}>
                <PopperWrapper>
                    <AccountPreview user={data.info} />
                </PopperWrapper>
            </div>
        );
    };

    return (
        <div>
            <Tippy interactive delay={[300, 100]} offset={[-150, -30]} placement="bottom-start" render={renderPreview}>
                <div className={cx('account-item')}>
                    <Image className={cx('avatar')} src={data.info.avatarUrl} alt="" />
                    <div className={cx('item-info')}>
                        <p className={cx('nickname')}>
                            <strong>{`${data.info.firstName} ${data.info.lastName}`}</strong>
                        </p>
                    </div>
                </div>
            </Tippy>
        </div>
    );
}

export default AccountItem;
