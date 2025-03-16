import classNames from 'classnames/bind';
import styles from './AccountPopper.module.scss';
import Tippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import AccountPreview from '../../AccountPreview';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
import { Avatar } from 'antd';
import PostStatusIcon from '../PostStatusIcon/PostStatusIcon';
import TimeAgoTooltip from '../../Time/TimeAgoTooltip';

const cx = classNames.bind(styles);

function AccountPopper({ data }) {
    const navigate = useNavigate();

    const renderPreview = (props) => {
        return (
            <div tabIndex="-1" {...props}>
                <PopperWrapper>
                    <AccountPreview user={data.user} />
                </PopperWrapper>
            </div>
        );
    };

    if (!data.user) return null;

    return (
        <>
            {data && (
                <div className={cx('account-item')}>
                    <Avatar src={data.user.avatarUrl} alt={data.user.avatarUrl} size={40} />

                    <div
                        className={cx('item-info')}
                        onClick={() => {
                            navigate(`${config.routes.profile.replace(':id', data.user.userId)}`);
                        }}
                    >
                        <Tippy
                            interactive
                            offset={[-120, 0]}
                            delay={[300, 100]}
                            placement="bottom-start"
                            render={renderPreview}
                        >
                            <p className={cx('nickname')}>
                                <span>{data.user.firstName + ' ' + data.user.lastName}</span>
                            </p>
                        </Tippy>

                        <div className={cx('time')}>
                            <PostStatusIcon status={data.status} />
                            <TimeAgoTooltip date={data.createdDate} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AccountPopper;
