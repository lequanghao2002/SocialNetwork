import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Empty } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import Post from '../Post';
import { currentPageSelector, hasMoreSelector, postsSelector } from '~/features/post/postSelector';
import classNames from 'classnames/bind';
import styles from './ListPost.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostsThunk, fetchSavedPostsThunk } from '~/features/post/postThunk';
import config from '~/config';

const cx = classNames.bind(styles);

function ListPost() {
    const dispatch = useDispatch();
    const posts = useSelector(postsSelector);
    const hasMore = useSelector(hasMoreSelector);
    const currentPage = useSelector(currentPageSelector);

    const handleNext = async () => {
        if (posts.length === 0) return;

        switch (currentPage) {
            case config.routes.home:
                dispatch(fetchPostsThunk());
                break;
            case config.routes.bookmark:
                dispatch(fetchSavedPostsThunk());
                break;
            default:
                break;
        }
    };

    return (
        <InfiniteScroll
            dataLength={posts.length}
            next={handleNext}
            hasMore={hasMore}
            loader={
                <div className={cx('loading')}>
                    <FontAwesomeIcon icon={faSpinner} className="search-loading" />
                </div>
            }
            endMessage={
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<p className={cx('no-data')}>No data</p>} />
            }
        >
            <div className={cx('post-body')}>
                {posts.map((post) => (
                    <div key={post.id}>
                        <Post data={post} />
                    </div>
                ))}
            </div>
        </InfiniteScroll>
    );
}

export default ListPost;
