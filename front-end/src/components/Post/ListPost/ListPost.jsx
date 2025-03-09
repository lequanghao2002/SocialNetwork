import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Empty } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import Post from '../Post';
import { postsSelector } from '~/features/post/postSelector';
import classNames from 'classnames/bind';
import styles from './ListPost.module.scss';
import { filterSelector, pagingSelector } from '~/features/post/postSelector';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchPostsThunk } from '~/features/post/postThunk';

const cx = classNames.bind(styles);

function ListPost() {
    const dispatch = useDispatch();
    const filter = useSelector(filterSelector);
    const paging = useSelector(pagingSelector);
    const posts = useSelector(postsSelector);

    useEffect(() => {
        dispatch(fetchPostsThunk({ filter, paging }));
    }, [filter, paging]);

    return (
        <InfiniteScroll
            dataLength={posts.length}
            // next={fetchPosts}
            // hasMore={hasMore}
            loader={
                <div className={cx('loading')}>
                    <FontAwesomeIcon icon={faSpinner} className="search-loading" />
                    <span>Loading</span>
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
