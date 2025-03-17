import classNames from 'classnames/bind';
import styles from './SidebarLeft.module.scss';
import Menu, { MenuItem } from './Menu';
import config from '~/config';
import { faBookmark, faCommentDots, faHome, faUserFriends } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function SidebarLeft() {
    return (
        <aside className={cx('wrapper')}>
            <Menu>
                <MenuItem title="News Feed" to={config.routes.home} icon={faHome}></MenuItem>
                <MenuItem title="Messages" to={config.routes.message} icon={faCommentDots}></MenuItem>
                <MenuItem title="Friends" to={config.routes.friend} icon={faUserFriends}></MenuItem>
                <MenuItem title="Bookmarks" to={config.routes.bookmark} icon={faBookmark}></MenuItem>
            </Menu>
        </aside>
    );
}

export default SidebarLeft;
