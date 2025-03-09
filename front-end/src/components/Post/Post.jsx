import { useContext, useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Post.module.scss';
import Button from '../Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBookmark,
    faEllipsisVertical,
    faMessage,
    faPenToSquare,
    faShare,
    faThumbsUp,
    faTrash,
} from '@fortawesome/free-solid-svg-icons';
import AccountPopper from '~/components/AccountPopper';
import { Image, Modal } from 'antd';
import Menu from '~/components/Popper/Menu';
import PostModal from '~/components/Modals/PostModal/PostModal';
import postService from '~/services/postService';
import * as modePostConstant from '~/constant';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '~/context/Notification';
import { AppContext } from '~/context/AppProvider';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector } from '~/features/auth/authSelector';
import { setLike } from '~/features/post/postSlice';
import { openModal } from '~/features/modal/modalSlice';
import { deletePostThunk } from '~/features/post/postThunk';

const cx = classNames.bind(styles);

function Post({ data, disableActionButton = false }) {
    const dispatch = useDispatch();
    const user = useSelector(userSelector);
    const [sharedPost, setSharedPost] = useState(null);
    const [sharedCount, setSharedCount] = useState(0);
    const { success, error } = useNotification();
    const navigate = useNavigate();

    const isOwner = data.userId === user.id;
    const isSaved = data?.usersFavourite?.some((item) => item.userId === user.id);

    const imageArray = data.images ? JSON.parse(data.images) : null;
    const isLiked = data.likes.some((like) => like.userId === user.id);

    console.log(data);

    const ACTION_POST = [
        ...(isOwner
            ? [
                  {
                      icon: <FontAwesomeIcon icon={faPenToSquare} />,
                      title: 'Update post',
                  },
                  {
                      icon: <FontAwesomeIcon icon={faTrash} />,
                      title: 'Delete post',
                  },
              ]
            : []),
        {
            icon: <FontAwesomeIcon icon={faBookmark} />,
            title: isSaved ? 'UnSave post' : 'Save post',
        },
    ];

    const handleMenuChange = (menuItem) => {
        switch (menuItem.title) {
            case 'Update post': {
                dispatch(openModal({ name: 'post', type: 'update', data }));
                break;
            }
            case 'Delete post': {
                Modal.confirm({
                    title: 'Are you sure you want to delete this post?',
                    content: 'This action cannot be undone.',
                    className: 'custom-dark-modal',
                    okText: 'Yes',
                    cancelText: 'Cancel',
                    onOk: () => dispatch(deletePostThunk(data.id)),
                });
                break;
            }
            case 'Save post': {
                handleSave('Save post');
                break;
            }
            case 'UnSave post': {
                handleSave('UnSave post');
                break;
            }
            default:
        }
    };

    const handleSave = async (action) => {
        // const dataSave = {
        //     userId: user.Id,
        //     postId: data.id,
        // };
        // const result = await postService.savePost(dataSave);
        // if (result) {
        //     console.log(posts);
        //     const updatedPosts = posts.map((post) => (post.id === result.id ? result : post));
        //     console.log(updatedPosts);
        //     setPosts(updatedPosts);
        //     success(`${action} success`);
        // } else {
        //     error(`${action} error`);
        //     console.error('comment error');
        // }
    };

    const convertNewlinesToBreaks = (text) => {
        return text.replace(/\n/g, '<br/>');
    };

    const handeLikeClick = async () => {
        const result = await postService.changeLike({ userId: user.id, postId: data.id });
        if (result === 'Liked') {
            dispatch(setLike({ id: data.id, userId: user.id, type: 'add' }));
        } else if (result === 'Unlike') {
            dispatch(setLike({ id: data.id, userId: user.id, type: 'delete' }));
        }
    };

    const handleSharedPost = () => {
        setModePost(modePostConstant.modeShare);
        setPostCurrent(data);
        setIsPostModalVisible(true);
    };

    useEffect(() => {
        if (data.sharedPostId) {
            fetchSharedPost(data.sharedPostId);
        }
    }, [data.sharedPostId]);

    const fetchSharedPost = async (sharedPostId) => {
        const result = await postService.getPostById(sharedPostId);
        if (result) {
            setSharedPost(result);
        } else {
            console.error('Failed to fetch shared post');
        }
    };

    const SharedPost = ({ sharedPost }) => {
        if (!sharedPost) return null;

        let sharedImageArray = [];
        if (sharedPost.images) {
            sharedImageArray = JSON.parse(sharedPost.images);
        }

        return (
            <div className={cx('share-post')}>
                <div className={cx('header')}>
                    <AccountPopper data={sharedPost} />
                </div>

                <div className={cx('body')}>
                    <p
                        className={cx('text')}
                        dangerouslySetInnerHTML={{ __html: convertNewlinesToBreaks(sharedPost.content) }}
                    ></p>
                    <Image.PreviewGroup
                        preview={{
                            onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                        }}
                    >
                        {sharedImageArray.map((imageUrl, index) => (
                            <div className={cx('image')} key={index}>
                                <Image
                                    width={100}
                                    height={100}
                                    src={`${import.meta.env.REACT_APP_BASE_URL2}${imageUrl}`}
                                />
                            </div>
                        ))}
                    </Image.PreviewGroup>
                </div>

                <div className={cx('footer')}>
                    {sharedPost.listTag &&
                        sharedPost.listTag.map((item, index) => (
                            <span key={index} className={cx('tag')}>
                                #{item.name}
                            </span>
                        ))}
                </div>
            </div>
        );
    };

    useEffect(() => {
        //fetchCountPostShared(data.id);
    }, [data.id]);

    const fetchCountPostShared = async (id) => {
        const result = await postService.countSharedPost(id);
        if (result) {
            setSharedCount(result);
        } else {
            console.error('Failed to fetch shared post count');
        }
    };
    return (
        <>
            {/* <PostDetailModal
                visible={showPostDetailModal}
                setVisible={setShowPostDetailModal}
                onClose={() => setShowPostDetailModal(false)}
                post={data}
                handlePostSubmit={handlePostSubmit}
                handleDeletePost={handleDeletePost}
                handleLikeChange={handleLikeChange}
                posts={posts}
                setPosts={setPosts}
            ></PostDetailModal> */}

            <div className={cx('wrapper')}>
                <div className={cx('header')}>
                    <AccountPopper data={data} />

                    <Menu items={ACTION_POST} onChange={handleMenuChange}>
                        <span>
                            <FontAwesomeIcon className={cx('icon-ellipsis')} icon={faEllipsisVertical} />
                        </span>
                    </Menu>
                </div>

                <div className={cx('body')}>
                    <p
                        className={cx('text')}
                        dangerouslySetInnerHTML={{ __html: convertNewlinesToBreaks(data.content) }}
                    ></p>
                    <Image.PreviewGroup
                        preview={{
                            onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                        }}
                    >
                        {imageArray &&
                            imageArray.map((url, index) => (
                                <div key={index} className={cx('image')}>
                                    <Image width={100} height={100} src={url} />
                                </div>
                            ))}
                    </Image.PreviewGroup>
                </div>

                <div className={cx('footer')}>
                    {data.listTag &&
                        data.listTag.map((item, index) => (
                            <span key={index} className={cx('tag')}>
                                #{item.name}
                            </span>
                        ))}

                    {data.sharedPostId !== '' && <SharedPost sharedPost={sharedPost} />}

                    <div className={cx('interact')}>
                        <Button
                            className={isLiked ? cx('buttonLiked') : ''}
                            leftIcon={<FontAwesomeIcon icon={faThumbsUp} />}
                            onClick={() => {
                                if (disableActionButton) return;
                                handeLikeClick();
                            }}
                        >
                            {data.likes.length || 0}
                        </Button>
                        <Button
                            leftIcon={<FontAwesomeIcon icon={faMessage} />}
                            onClick={() => {
                                if (disableActionButton) return;
                                setShowPostDetailModal(true);
                            }}
                        >
                            {data.comments.length || 0}
                        </Button>
                        <Button
                            leftIcon={<FontAwesomeIcon icon={faShare} />}
                            onClick={() => {
                                if (disableActionButton) return;
                                handleSharedPost();
                            }}
                        >
                            {sharedCount}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Post;
