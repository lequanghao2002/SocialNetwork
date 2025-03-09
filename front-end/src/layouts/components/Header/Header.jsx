import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faLanguage,
    faCircleQuestion,
    faKeyboard,
    faCode,
    faUser,
    faCoins,
    faGear,
    faSignOut,
    faBell,
    faCommentDots,
} from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Link } from 'react-router-dom';

import styles from './Header.module.scss';
import Button from '~/components/Button';
import Menu from '~/components/Popper/Menu';
import Image from '~/components/Image';
import Search from '../Search';
import config from '~/config';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeLocalStorage } from '~/utils/localStorage';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector } from '~/features/auth/authSelector';
import { logout } from '~/features/auth/authSlice';

const cx = classNames.bind(styles);

const MENU_ITEMS = [
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
        to: '/feedback',
    },
    {
        icon: <FontAwesomeIcon icon={faKeyboard}></FontAwesomeIcon>,
        title: 'Keyboard shortcuts',
    },
];

function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(userSelector);

    console.log({ user });

    // Handle logic
    const handleMenuChange = (menuItem) => {
        switch (menuItem.title) {
            case 'View profile': {
                navigate(`${config.routes.profile.replace(':id', user.Id)}`);
                break;
            }
            case 'Log out': {
                dispatch(logout());
                break;
            }
            default:
        }
    };

    const userMenu = [
        {
            icon: <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>,
            title: 'View profile',
            //to: '/@hoaa',
        },
        {
            icon: <FontAwesomeIcon icon={faCoins}></FontAwesomeIcon>,
            title: 'Get coins',
            to: '/coin',
        },
        {
            icon: <FontAwesomeIcon icon={faGear}></FontAwesomeIcon>,
            title: 'Settings',
            to: '/settings',
        },
        ...MENU_ITEMS,
        {
            icon: <FontAwesomeIcon icon={faSignOut}></FontAwesomeIcon>,
            title: 'Log out',
            //to: '/logout',
            separate: true,
        },
    ];

    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Link to={config.routes.home} className={cx('logo')}>
                    {/* <img src={images.logo} alt="tiktok"></img> */}
                    <FontAwesomeIcon icon={faCode} /> Coding
                </Link>

                <Search />

                <div className={cx('actions')}>
                    {user ? (
                        <>
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

                            <Menu items={user ? userMenu : MENU_ITEMS} onChange={handleMenuChange}>
                                <Image
                                    src={user.AvatarUrl}
                                    className={cx('user-avatar')}
                                    alt={user.displayName}
                                ></Image>
                            </Menu>
                        </>
                    ) : (
                        <>
                            <Button text to={config.routes.login}>
                                Log In
                            </Button>
                            <Button primary>Sign Up</Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
