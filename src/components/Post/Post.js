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
import { Image } from 'antd';
import Menu from '~/components/Popper/Menu';
import { AppContext } from '~/context/AppProvider';
import PostModal from '~/components/Modals/PostModal';
import * as postService from '~/services/postService';
import { AuthContext, NotificationContext } from '~/context';
import * as modePostConstant from '~/constant';
import { useNavigate } from 'react-router-dom';
import PostDetailModal from '../Modals/PostDetailModal';

const cx = classNames.bind(styles);

function Post({
    data,
    handlePostSubmit,
    handleDeletePost,
    handleLikeChange,
    disableActionButton = false,
    posts,
    setPosts,
}) {
    const { isPostModalVisible, setIsPostModalVisible, postCurrent, setPostCurrent, modePost, setModePost } =
        useContext(AppContext);
    const [checkLike, setCheckLike] = useState();
    const { user } = useContext(AuthContext);
    const [sharedPost, setSharedPost] = useState(null);
    const [sharedCount, setSharedCount] = useState(0);
    const [showPostDetailModal, setShowPostDetailModal] = useState(null);
    const { success, error } = useContext(NotificationContext);
    const navigate = useNavigate();
    let imageArray = [];
    if (data.images) {
        imageArray = JSON.parse(data.images);
    }

    useEffect(() => {
        const isLiked = data.likes.some((item) => item.userId === user.Id);
        setCheckLike(isLiked);
    }, [data.likes]);

    const ACTION_POST =
        data.userId === user.Id
            ? data?.usersFavourite?.find((item) => item.userId === user.Id)
                ? [
                      {
                          icon: <FontAwesomeIcon icon={faPenToSquare}></FontAwesomeIcon>,
                          title: 'Update post',
                      },
                      {
                          icon: <FontAwesomeIcon icon={faBookmark}></FontAwesomeIcon>,
                          title: 'UnSave post',
                      },

                      {
                          icon: <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>,
                          title: 'Delete post',
                      },
                  ]
                : [
                      {
                          icon: <FontAwesomeIcon icon={faPenToSquare}></FontAwesomeIcon>,
                          title: 'Update post',
                      },
                      {
                          icon: <FontAwesomeIcon icon={faBookmark}></FontAwesomeIcon>,
                          title: 'Save post',
                      },

                      {
                          icon: <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>,
                          title: 'Delete post',
                      },
                  ]
            : data?.usersFavourite?.find((item) => item.userId === user.Id)
            ? [
                  {
                      icon: <FontAwesomeIcon icon={faBookmark}></FontAwesomeIcon>,
                      title: 'UnSave post',
                  },
              ]
            : [
                  {
                      icon: <FontAwesomeIcon icon={faBookmark}></FontAwesomeIcon>,
                      title: 'Save post',
                  },
              ];

    // Handle logic
    const handleMenuChange = (menuItem) => {
        switch (menuItem.title) {
            case 'Update post': {
                setPostCurrent(data);
                setModePost(modePostConstant.modeUpdate);
                setIsPostModalVisible(true);
                break;
            }
            case 'Delete post': {
                handleDelete();
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
        const dataSave = {
            userId: user.Id,
            postId: data.id,
        };
        const result = await postService.savePost(dataSave);
        if (result) {
            console.log(posts);
            const updatedPosts = posts.map((post) => (post.id === result.id ? result : post));
            console.log(updatedPosts);

            setPosts(updatedPosts);
            success(`${action} success`);
        } else {
            error(`${action} error`);
            console.error('comment error');
        }
    };

    const handleDelete = () => {
        handleDeletePost(data.id);
    };

    const convertNewlinesToBreaks = (text) => {
        return text.replace(/\n/g, '<br/>');
    };

    const onLikeClick = async () => {
        const result = await postService.changeLike({ userId: user.Id, postId: data.id });
        if (result) {
            handleLikeChange(data.id, user.Id);
            setCheckLike(!checkLike);
        } else {
            console.error('Failed to like post');
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
                                <Image width={100} height={100} src={`${process.env.REACT_APP_BASE_URL2}${imageUrl}`} />
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
        fetchCountPostShared(data.id);
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
            <PostDetailModal
                visible={showPostDetailModal}
                setVisible={setShowPostDetailModal}
                onClose={() => setShowPostDetailModal(false)}
                post={data}
                handlePostSubmit={handlePostSubmit}
                handleDeletePost={handleDeletePost}
                handleLikeChange={handleLikeChange}
                posts={posts}
                setPosts={setPosts}
            ></PostDetailModal>

            <div className={cx('wrapper')}>
                <div className={cx('header')}>
                    <AccountPopper data={data} />

                    {/* <PostModal data={data} /> */}
                    <PostModal onSubmit={handlePostSubmit} />
                    <Menu items={ACTION_POST} onChange={handleMenuChange}>
                        <span>
                            <FontAwesomeIcon className={cx('icon-ellipsis')} icon={faEllipsisVertical} />
                        </span>
                    </Menu>
                </div>

                <div className={cx('body')}>
                    {/* <p className={cx('text')}>{data.content}</p> */}
                    <p
                        className={cx('text')}
                        dangerouslySetInnerHTML={{ __html: convertNewlinesToBreaks(data.content) }}
                    ></p>
                    <Image.PreviewGroup
                        preview={{
                            onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                        }}
                    >
                        {imageArray.map((imageUrl, index) => (
                            <div key={index} className={cx('image')}>
                                <Image width={100} height={100} src={`${process.env.REACT_APP_BASE_URL2}${imageUrl}`} />
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
                            className={checkLike ? cx('buttonLiked') : ''}
                            leftIcon={<FontAwesomeIcon icon={faThumbsUp} />}
                            onClick={() => {
                                if (disableActionButton) return;
                                onLikeClick();
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
