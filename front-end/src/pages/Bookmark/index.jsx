import classNames from 'classnames/bind';
import styles from './Bookmark.module.scss';
import Button from '~/components/Button';
import {
    faClock,
    faFaceSmile,
    faFileCode,
    faFileImage,
    faFileLines,
    faFire,
    faSpinner,
    faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Avatar from '~/components/Image';
import Icon from '~/components/Icon';
import Post from '~/components/Post';
import { useContext, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import postService from '~/services/postService';
import PostModal from '~/components/Modals/PostModal';
import { Empty, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import AuthContext from '~/context/AuthContext/authContext';

const cx = classNames.bind(styles);

function Bookmark() {
    const [posts, setPosts] = useState([]);
    const { user } = useContext(AuthContext);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    const success = (message) => {
        messageApi.open({
            type: 'success',
            content: message,
            style: {},
        });
    };

    const error = (message) => {
        messageApi.open({
            type: 'error',
            content: message,
            style: {},
        });
    };

    const fetchPosts = async () => {
        try {
            const result = await postService.getPostSaveById(user.Id, page, 10);

            if (result) {
                console.log({ result, posts });
                setPosts([...posts, ...result]);
                setPage(page + 1);
                if (result.length === 0) {
                    setHasMore(false);
                }
                console.log({ result, posts });
            } else {
                console.error('Invalid data format:', result);
            }
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <>
            {contextHolder}
            <div className={cx('wrapper')}>
                <InfiniteScroll
                    dataLength={posts?.length}
                    next={fetchPosts}
                    hasMore={hasMore}
                    loader={
                        <div className={cx('loading')}>
                            <FontAwesomeIcon icon={faSpinner} className="search-loading" />
                            <span>Loading</span>
                        </div>
                    }
                    endMessage={
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={<p className={cx('no-data')}>No data</p>}
                        />
                    }
                >
                    <div className={cx('post-body')}>
                        {posts?.map((item) => (
                            <div key={item.id}>
                                <Post data={item} />
                            </div>
                        ))}
                    </div>
                </InfiniteScroll>
            </div>
        </>
    );
}

export default Bookmark;
