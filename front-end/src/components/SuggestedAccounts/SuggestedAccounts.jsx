import classNames from 'classnames/bind';
import styles from './SuggestedAccounts.module.scss';
import AccountItem from './AccountItem';
import { useSelector } from 'react-redux';
import { friendsSelector } from '~/features/chat/chatSelector';

const cx = classNames.bind(styles);

function SuggestedAccounts({ label }) {
    const friends = useSelector(friendsSelector);

    return (
        <div className={cx('wrapper')}>
            <p className={cx('label')}>{label}</p>

            {friends?.map((item, index) => (
                <AccountItem key={index} data={item}></AccountItem>
            ))}
        </div>
    );
}

export default SuggestedAccounts;
