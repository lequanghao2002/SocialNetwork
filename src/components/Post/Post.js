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
import { AuthContext } from '~/context';
import * as modePostConstant from '~/constant';

const cx = classNames.bind(styles);

function Post({ data, handlePostSubmit, handleDeletePost, handleLikeChange }) {
    const { isPostModalVisible, setIsPostModalVisible, postCurrent, setPostCurrent, modePost, setModePost } =
        useContext(AppContext);
    const [checkLike, setCheckLike] = useState();
    const { user } = useContext(AuthContext);

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
            ? [
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
                //onDeletePost(data.id);
                handleDelete();
                break;
            }
            default:
        }
    };

    // const onDeletePost = async (id) => {
    //     try {
    //         const result = await postService.deletePost(id);
    //         if (result) {
    //         } else {
    //             console.error('Invalid data format:', result);
    //         }
    //     } catch (error) {
    //         console.error('Failed to fetch posts:', error);
    //     }
    // };

    const handleDelete = () => {
        handleDeletePost(data.id);
    };

    // const handleLikeChange = async () => {
    //     console.log('start');
    //     try {
    //         const result = await postService.changeLike({ userId: userIDFake, postId: data.id });
    //         if (result) {
    //             console.log(result);
    //         } else {
    //             console.error('Invalid data format:', result);
    //         }
    //     } catch (error) {
    //         console.error('Failed to fetch posts:', error);
    //     }
    // };

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

    return (
        <>
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
                            <div className={cx('image')}>
                                <Image
                                    key={index}
                                    width={100}
                                    height={100}
                                    src={`${process.env.REACT_APP_BASE_URL2}${imageUrl}`}
                                />
                            </div>
                        ))}
                    </Image.PreviewGroup>
                </div>

                <div className={cx('footer')}>
                    {data.listTag &&
                        data.listTag.map((item) => (
                            <span key={item.id} className={cx('tag')}>
                                #{item.name}
                            </span>
                        ))}
                    <div className={cx('interact')}>
                        <Button
                            className={checkLike ? cx('buttonLiked') : ''}
                            leftIcon={<FontAwesomeIcon icon={faThumbsUp} onClick={onLikeClick} />}
                        >
                            {data.likes.length || 0}
                        </Button>
                        <Button leftIcon={<FontAwesomeIcon icon={faMessage} />}>10</Button>
                        <Button leftIcon={<FontAwesomeIcon icon={faShare} onClick={handleSharedPost} />}>5</Button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Post;
