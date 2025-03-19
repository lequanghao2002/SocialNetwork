import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faLanguage,
    faCircleQuestion,
    faKeyboard,
    faCode,
    faUser,
    faSignOut,
    faBell,
    faCommentDots,
} from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Link } from 'react-router-dom';
import Button from '~/components/Button';
import styles from './Header.module.scss';
import Menu from '~/components/Popper/Menu';
import Image from '~/components/Image';
import Search from '../Search';
import config from '~/config';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector } from '~/features/auth/authSelector';
import { logout } from '~/features/auth/authSlice';

const cx = classNames.bind(styles);

const MENU_ITEMS = [
    {
        icon: <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>,
        title: 'View profile',
    },
    {
        icon: <FontAwesomeIcon icon={faLanguage}></FontAwesomeIcon>,
        title: 'English',
        children: {
            title: 'Language',
            data: [
                {
                    type: 'language',
                    code: 'en',
                    title: 'English',
                },
                {
                    type: 'language',
                    code: 'vi',
                    title: 'Việt Nam',
                },
            ],
        },
    },
    {
        icon: <FontAwesomeIcon icon={faCircleQuestion}></FontAwesomeIcon>,
        title: 'Feedback and help',
    },
    {
        icon: <FontAwesomeIcon icon={faKeyboard}></FontAwesomeIcon>,
        title: 'Keyboard shortcuts',
    },
    {
        icon: <FontAwesomeIcon icon={faSignOut}></FontAwesomeIcon>,
        title: 'Log out',
        separate: true,
    },
];

function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(userSelector);

    // Handle logic
    const handleMenuChange = (menuItem) => {
        switch (menuItem.title) {
            case 'View profile': {
                navigate(`${config.routes.profile.replace(':id', user.id)}`);
                break;
            }
            case 'Log out': {
                dispatch(logout());
                break;
            }
            default:
                alert('comming soon');
                break;
        }
    };

    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Link to={config.routes.home} className={cx('logo')}>
                    <FontAwesomeIcon icon={faCode} /> Coding
                </Link>

                <Search />

                <div className={cx('actions')}>
                    <Tippy delay={[0, 100]} content="notification" placement="bottom">
                        <button className={cx('action-btn')}>
                            <FontAwesomeIcon className={cx('btn')} icon={faBell} />
                        </button>
                    </Tippy>

                    <Tippy delay={[0, 100]} content="messenger" placement="bottom">
                        <button className={cx('action-btn')}>
                            <FontAwesomeIcon className={cx('btn')} icon={faCommentDots} />
                        </button>
                    </Tippy>

                    <Menu items={MENU_ITEMS} onChange={handleMenuChange}>
                        <Image src={user.AvatarUrl} className={cx('user-avatar')} alt={user.displayName}></Image>
                    </Menu>
                </div>
            </div>
        </header>
    );
}

export default Header;
