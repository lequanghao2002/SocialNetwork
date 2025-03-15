import classNames from 'classnames/bind';
import styles from './AccountPopper.module.scss';
import Tippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import AccountPreview from './AccountPreview';
import Image from '../Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEarthAfrica, faLock, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
import userService from '~/services/userService';
import { useEffect, useState } from 'react';
import { dateFormat } from '~/utils/dateFormat';
import { Avatar, Tooltip } from 'antd';

const cx = classNames.bind(styles);

function AccountPopper({ data }) {
    const navigate = useNavigate();
    const [userById, setUserById] = useState({});

    useEffect(() => {
        fetchUserById(data.userId);
    }, []);

    const fetchUserById = async (Id) => {
        try {
            const result = await userService.getUserById(Id);
            setUserById(result);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        }
    };

    var user = data.user;

    const renderPreview = (props) => {
        return (
            <div tabIndex="-1" {...props}>
                <PopperWrapper>
                    <AccountPreview user={userById} />
                </PopperWrapper>
            </div>
        );
    };

    return (
        <>
            {user && (
                <div className={cx('account-item')}>
                    <Avatar src={user.avatarUrl} alt={user.avatarUrl} size={40} />

                    <div
                        className={cx('item-info')}
                        onClick={() => {
                            navigate(`${config.routes.profile.replace(':id', data.userId)}`);
                        }}
                    >
                        <Tippy
                            interactive
                            offset={[-150, -30]}
                            delay={[300, 100]}
                            placement="bottom-start"
                            render={renderPreview}
                        >
                            <p className={cx('nickname')}>
                                <span>{user.firstName + ' ' + user.lastName}</span>
                            </p>
                        </Tippy>

                        <p className={cx('time')}>
                            {data.status === 1 ? (
                                <FontAwesomeIcon icon={faEarthAfrica} />
                            ) : data.status === 2 ? (
                                <FontAwesomeIcon icon={faUserGroup} />
                            ) : data.status === 3 ? (
                                <FontAwesomeIcon icon={faLock} />
                            ) : null}

                            <Tooltip title={dateFormat.fullDateTime(data.createdDate)} placement="bottom">
                                {dateFormat.timeFromNow(data.createdDate)}
                            </Tooltip>
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}

export default AccountPopper;
