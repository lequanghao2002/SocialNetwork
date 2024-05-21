import Header from '~/layouts/components/Header';
import SidebarLeft from '../components/SidebarLeft';
import classNames from 'classnames/bind';
import styles from './DefaultLayout.module.scss';
import SidebarRight from '../components/SidebarRight';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('container')}>
                <SidebarLeft />
                <div className={cx('main')}>{children}</div>
                <SidebarRight />
            </div>
        </div>
    );
}

export default DefaultLayout;
