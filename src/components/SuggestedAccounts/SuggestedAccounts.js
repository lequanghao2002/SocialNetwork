import classNames from 'classnames/bind';
import styles from './SuggestedAccounts.module.scss';
import AccountItem from './AccountItem';

const cx = classNames.bind(styles);

function SuggestedAccounts({ label }) {
    return (
        <div className={cx('wrapper')}>
            <p className={cx('label')}>{label}</p>
            <AccountItem></AccountItem>
            <AccountItem></AccountItem>
            <AccountItem></AccountItem>
            <AccountItem></AccountItem>
        </div>
    );
}

export default SuggestedAccounts;
