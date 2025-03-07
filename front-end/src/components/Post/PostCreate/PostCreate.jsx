import classNames from 'classnames/bind';
import styles from './PostCreate.module.scss';
import { useContext } from 'react';
import AuthContext from '~/context/AuthContext/authContext';

const cx = classNames.bind(styles);

function PostCreate() {
    const { user } = useContext(AuthContext);
    return (
        <div className={cx('post-new')}>
            <div className={cx('header')}>
                <Avatar src={user.AvatarUrl} alt={user.Email} />
                {/* <PostModal onSubmit={handlePostSubmit} /> */}
                <div className={cx('input')} onClick={handleShowPostModel}>
                    <span className={cx('text')}>Share your programming knowledge here...</span>
                    <span className={cx('icon')}>
                        <FontAwesomeIcon icon={faFaceSmile} />
                    </span>
                </div>
            </div>
            <div className={cx('option')}>
                <Icon icon={faFileCode} rightText={'Code'} />
                <Icon icon={faFileImage} rightText={'Image'} />
                <Icon icon={faFileLines} rightText={'File'} />
            </div>
        </div>
    );
}

export default PostCreate;
