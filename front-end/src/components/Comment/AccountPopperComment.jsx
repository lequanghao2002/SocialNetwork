import classNames from 'classnames/bind';
import styles from './Comment.module.scss';
import { useNavigate } from 'react-router-dom';
import AccountPreview from '~/components/AccountPreview';
import Tippy from '@tippyjs/react/headless';
import { Wrapper } from '~/components/Popper';

const cx = classNames.bind(styles);

function AccountPopperComment({ children, data }) {
    const navigate = useNavigate();

    const renderPreview = (props) => {
        return (
            <div tabIndex="-1" {...props}>
                <Wrapper>
                    <AccountPreview user={data} />
                </Wrapper>
            </div>
        );
    };

    return (
        <>
            {data && (
                <div
                    onClick={() => {
                        navigate(`${config.routes.profile.replace(':id', data.userId)}`);
                    }}
                >
                    <Tippy
                        interactive
                        offset={[-120, 0]}
                        delay={[300, 100]}
                        placement="bottom-start"
                        render={renderPreview}
                    >
                        {children}
                    </Tippy>
                </div>
            )}
        </>
    );
}

export default AccountPopperComment;
