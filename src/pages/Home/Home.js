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
    faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Avatar from '~/components/Image';
import Icon from '~/components/Icon';
import Post from '~/components/Post';
import { useContext, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AppContext, AuthContext } from '~/context';
import * as postService from '~/services/postService';
import PostModal from '~/components/Modals/PostModal';
import { Empty, message } from 'antd';
import * as modePostConstant from '~/constant';

const cx = classNames.bind(styles);

function Home({ profile }) {
    const { isPostModalVisible, setIsPostModalVisible, modePost, setModePost } = useContext(AppContext);
    const { user } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [messageApi, contextHolder] = message.useMessage();

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
            const result = await postService.getAllPost(page, 10);
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

    // const handleLikeChange = (postId, userId) => {
    //     setPosts((prevPosts) =>
    //         prevPosts.map((post) => {
    //             if (post.id === postId) {
    //                 const isLiked = post.likes.some((like) => like.userId === userId);
    //                 if (isLiked) {
    //                     post.likes = post.likes.filter((like) => like.userId !== userId);
    //                 } else {
    //                     post.likes.push({ userId });
    //                 }
    //             }
    //             return post;
    //         }),
    //     );
    // };

    // const handleLikeChange = (postId, userId) => {
    //     // Tạo một bản sao của danh sách bài viết
    //     const updatedPosts = [...posts];
    //     // Tìm kiếm bài viết cần cập nhật
    //     const postToUpdate = updatedPosts.find((post) => post.id === postId);
    //     if (postToUpdate) {
    //         // Cập nhật số lượng like trong bài viết
    //         postToUpdate.likes.push({ userId });
    //         // Cập nhật state của số lượng like
    //         setPosts(updatedPosts);
    //     }
    // };

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

    return (
        <>
            {contextHolder}
            <div className={cx('wrapper')}>
                <div className={cx('post-new')}>
                    <div className={cx('header')}>
                        <Avatar
                            src="https://scontent.fdad3-5.fna.fbcdn.net/v/t39.30808-1/442505173_1987519968317490_8947428851547572351_n.jpg?stp=dst-jpg_p200x200&_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeFZmrHNdMiqZcMt0SibqskPzIGptUJx7pTMgam1QnHulPU4bpplWwNcWG9e8wZ48RmfDfPFaa2-g3tmnNKLryps&_nc_ohc=tFe22mxkVYEQ7kNvgGvFxtu&_nc_ht=scontent.fdad3-5.fna&oh=00_AYA2TVm31yGxfRfyW9nTG88i-8dvLwloYMPc0GprmMLYiA&oe=664F5C98"
                            alt=""
                        />
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

                {profile || (
                    <div className={cx('post-nav')}>
                        <Button small leftIcon={<FontAwesomeIcon icon={faClock} />} className={cx('')}>
                            Recent
                        </Button>
                        <Button small leftIcon={<FontAwesomeIcon icon={faUsers} />} className={cx('')}>
                            Friends
                        </Button>
                        <Button small leftIcon={<FontAwesomeIcon icon={faFire} />} className={cx('')}>
                            Popular
                        </Button>
                    </div>
                )}

                <InfiniteScroll
                    dataLength={posts.length}
                    next={fetchPosts}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
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
