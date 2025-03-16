import classNames from 'classnames/bind';
import styles from './PostCreate.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector } from '~/features/auth/authSelector';
import Avatar from '~/components/Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSmile, faFileCode, faFileImage, faFileLines } from '@fortawesome/free-solid-svg-icons';
import Icon from '~/components/Icon';
import { openModal } from '~/features/modal/modalSlice';

const cx = classNames.bind(styles);

function PostCreate() {
    const dispatch = useDispatch();
    const user = useSelector(userSelector);

    const handleShowPostModel = () => {
        dispatch(openModal({ name: 'post', type: 'add' }));
    };

    return (
        <div className={cx('post-new')}>
            <div className={cx('header')}>
                <Avatar src={user.avatarUrl} alt={user.email} />
                <div className={cx('input')} onClick={handleShowPostModel}>
                    <span className={cx('text')}>Share your programming knowledge here...</span>
                    <span className={cx('icon')}>
                        <FontAwesomeIcon icon={faFaceSmile} />
                    </span>
                </div>
            </div>
            <div className={cx('option')}>
                <Icon icon={faFileCode} rightText={'Code'} onClick={() => alert('comming soon')} />
                <Icon icon={faFileImage} rightText={'Image'} onClick={() => alert('comming soon')} />
                <Icon icon={faFileLines} rightText={'File'} onClick={() => alert('comming soon')} />
            </div>
        </div>
    );
}

export default PostCreate;
