import classNames from 'classnames/bind';
import styles from './SidebarRight.module.scss';
import SuggestedAccounts from '~/components/SuggestedAccounts';

const cx = classNames.bind(styles);

function SidebarRight() {
    return (
        <aside className={cx('wrapper')}>
            <SuggestedAccounts label="Contact" />
        </aside>
    );
}

export default SidebarRight;
