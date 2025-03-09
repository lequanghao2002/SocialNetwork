import classNames from 'classnames/bind';
import styles from './Home.module.scss';
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
import Post from '~/components/Post/Post';
import { useContext, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import postService from '~/services/postService';
import PostModal from '~/components/Modals/PostModal/PostModal';
import { Empty, message } from 'antd';
import * as modePostConstant from '~/constant';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '~/context/AppProvider';
import { userSelector } from '~/features/auth/authSelector';
import { useSelector } from 'react-redux';

const cx = classNames.bind(styles);

function Home({ profile, profileId }) {
    const [posts, setPosts] = useState([]);
    const { isPostModalVisible, setIsPostModalVisible, modePost, setModePost } = useContext(AppContext);
    const user = useSelector(userSelector);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const [filter, setFilter] = useState('Recent');

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

    const fetchPosts = async (newFilter = null, reset = false) => {
        console.log({ filter }, { newFilter }, { reset });
        const filterParam = newFilter ? newFilter : filter;
        try {
            let result;
            let currentPage = reset ? 1 : page;

            if (profile) {
                result = await postService.getAllPostByUserId(profileId, currentPage, 10);
            } else {
                if (filterParam === 'Friends') {
                    result = await postService.getAllPost('Friends', user.Id, currentPage, 10);
                } else if (filterParam === 'Popular') {
                    result = await postService.getAllPost('Popular', null, currentPage, 10);
                } else {
                    result = await postService.getAllPost('Recent', null, currentPage, 10);
                }
            }

            if (reset) {
                console.log('---reset');
                setPosts(result);
            } else {
                console.log('---no-reset');
                setPosts([...posts, ...result]);
            }
            setPage(currentPage + 1);
            if (result.length === 0) {
                setHasMore(false);
            }

            // if (result) {
            //     setPosts([...posts, ...result]);
            //     setPage(currentPage + 1);
            //     if (result.length === 0) {
            //         setHasMore(false);
            //     }
            // } else {
            //     console.error('Invalid data format:', result);
            // }
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        }
    };

    useEffect(() => {
        if (profileId) {
            setPosts([]);
        }
        fetchPosts();
    }, []);

    const handleShowPostModel = () => {
        setModePost(modePostConstant.modeAdd);
        setIsPostModalVisible(true);
    };

    const handlePostSubmit = (newPost) => {
        if (modePost === modePostConstant.modeAdd) {
            setPosts([newPost, ...posts]);
            success('Add post success');
        } else if (modePost === modePostConstant.modeUpdate) {
            const updatedPosts = posts.map((post) => (post.id === newPost.id ? newPost : post));
            setPosts(updatedPosts);
            success('Update post success');
        } else if (modePost === modePostConstant.modeShare) {
            setPosts([newPost, ...posts]);
            success('Share post success');
        } else {
            console.log('No mode post');
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            // Gọi API để xóa bài viết trên server
            const result = await postService.deletePost(postId);
            if (result) {
                // Cập nhật lại danh sách bài viết sau khi xóa thành công
                const updatedPosts = posts.filter((post) => post.id !== postId);
                setPosts(updatedPosts);
                success('Delete post success');
            } else {
                console.error('Failed to delete post:', result);
            }
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    };

    const handleLikeChange = (postId, userId) => {
        // Tạo một bản sao của danh sách bài viết
        const updatedPosts = [...posts];
        // Tìm kiếm bài viết cần cập nhật
        const postToUpdate = updatedPosts.find((post) => post.id === postId);
        if (postToUpdate) {
            // Kiểm tra nếu người dùng đã unlike
            const existingLikeIndex = postToUpdate.likes.findIndex((like) => like.userId === userId);
            if (existingLikeIndex !== -1) {
                // Nếu đã like, xóa like khỏi danh sách
                postToUpdate.likes.splice(existingLikeIndex, 1);
            } else {
                // Nếu chưa like, thêm like mới vào danh sách
                postToUpdate.likes.push({ userId });
            }
            // Cập nhật state của số lượng like
            setPosts(updatedPosts);
        }
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setPage(1);
        setHasMore(true);
        setPosts([]);
        fetchPosts(newFilter, true);
    };

    return (
        <>
            {contextHolder}
            <div className={cx('wrapper')}>
                {profile ? (
                    profileId === user.Id ? (
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
                    ) : (
                        <></>
                    )
                ) : (
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
                )}

                {profile || (
                    <div className={cx('post-nav')}>
                        <Button
                            small
                            leftIcon={<FontAwesomeIcon icon={faClock} />}
                            className={cx('', {
                                active: filter === 'Recent',
                            })}
                            onClick={() => handleFilterChange('Recent')}
                        >
                            Recent
                        </Button>
                        <Button
                            small
                            leftIcon={<FontAwesomeIcon icon={faUsers} />}
                            className={cx('', {
                                active: filter === 'Friends',
                            })}
                            onClick={() => handleFilterChange('Friends')}
                        >
                            Friends
                        </Button>
                        <Button
                            small
                            leftIcon={<FontAwesomeIcon icon={faFire} />}
                            className={cx('', {
                                active: filter === 'Popular',
                            })}
                            onClick={() => handleFilterChange('Popular')}
                        >
                            Popular
                        </Button>
                    </div>
                )}

                <InfiniteScroll
                    dataLength={posts.length}
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
                        {posts.map((item) => (
                            <div key={item.id}>
                                <Post
                                    data={item}
                                    handlePostSubmit={handlePostSubmit}
                                    handleDeletePost={handleDeletePost}
                                    handleLikeChange={handleLikeChange}
                                    posts={posts}
                                    setPosts={setPosts}
                                />
                            </div>
                        ))}
                    </div>
                </InfiniteScroll>
            </div>
        </>
    );
}

export default Home;
