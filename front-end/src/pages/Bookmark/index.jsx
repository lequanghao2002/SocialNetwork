import classNames from 'classnames/bind';
import styles from './Bookmark.module.scss';
import ListPost from '~/components/Post/ListPost/ListPost';

const cx = classNames.bind(styles);

function Bookmark() {
    return (
        <div className={cx('wrapper')}>
            <div center>
                <h2>List saved posts</h2>
            </div>

            <ListPost />
        </div>
    );
}

export default Bookmark;
