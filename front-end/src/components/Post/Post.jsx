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
import AccountPopper from '~/components/Post/AccountPopper';
import { Dropdown, Flex, Image, Modal } from 'antd';
import postService from '~/services/postService';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector } from '~/features/auth/authSelector';
import { setLike } from '~/features/post/postSlice';
import { openModal } from '~/features/modal/modalSlice';
import { deletePostThunk, savePostThunk, unSavePostThunk } from '~/features/post/postThunk';
import { useMessage } from '~/context/MessageProvider';

const cx = classNames.bind(styles);

function Post({ data, commentDisabled = false }) {
    const dispatch = useDispatch();
    const user = useSelector(userSelector);
    const { success, error } = useMessage();

    const isOwner = data.userId === user.id;
    const isSaved = data?.favourites?.some((item) => item.userId === user.id);

    const imageArray = data.images ? JSON.parse(data.images) : null;
    const isLiked = data.likes.some((like) => like.userId === user.id);

    const ACTION_POST = [
        ...(isOwner
            ? [
                  {
                      key: 'update',
                      label: (
                          <span>
                              <FontAwesomeIcon icon={faPenToSquare} /> Update Post
                          </span>
                      ),
                  },
                  {
                      key: 'delete',
                      label: (
                          <span>
                              <FontAwesomeIcon icon={faTrash} /> Delete Post
                          </span>
                      ),
                  },
              ]
            : []),
        {
            key: isSaved ? 'unSave' : 'save',
            label: (
                <span>
                    <FontAwesomeIcon icon={faBookmark} /> {isSaved ? 'UnSave Post' : 'Save Post'}
                </span>
            ),
        },
    ];

    const handleSave = async () => {
        try {
            await dispatch(savePostThunk(data.id)).unwrap();

            success('Save post successfully');
        } catch (err) {
            error('Save post failed');
        }
    };

    const handleUnSave = async () => {
        try {
            await dispatch(unSavePostThunk(data.id)).unwrap();

            success('Unsave post successfully');
        } catch (err) {
            error('Unsave post failed');
        }
    };

    const handleDelete = async () => {
        try {
            await dispatch(deletePostThunk(data.id)).unwrap();

            success('Delete post successfully');
        } catch (err) {
            error('Delete post failed');
        }
    };

    const handleActionClick = ({ key }) => {
        switch (key) {
            case 'update':
                dispatch(openModal({ name: 'post', type: 'update', data }));
                break;
            case 'delete':
                Modal.confirm({
                    title: 'Are you sure you want to delete this post?',
                    content: 'This action cannot be undone.',
                    className: 'custom-dark-modal',
                    okText: 'Yes',
                    cancelText: 'Cancel',
                    onOk: () => handleDelete(),
                });
                break;
            case 'save':
                handleSave();
                break;
            case 'unSave':
                handleUnSave();
                break;
            default:
                break;
        }
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

    const SharedPost = ({ data }) => {
        const imageArray = data.images ? JSON.parse(data.images) : null;

        return (
            <div className={cx('share-post')}>
                <div className={cx('header')}>
                    <AccountPopper data={data} />
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
                    {data.tags &&
                        data.tags.map((item, index) => (
                            <span key={index} className={cx('tag')}>
                                #{item.name}
                            </span>
                        ))}
                </div>
            </div>
        );
    };

    return (
        <>
            <div className={cx('wrapper')}>
                <div className={cx('header')}>
                    <Flex>
                        <AccountPopper data={data} />
                    </Flex>

                    <Dropdown menu={{ items: ACTION_POST, onClick: handleActionClick }}>
                        <span>
                            <FontAwesomeIcon className={cx('icon-ellipsis')} icon={faEllipsisVertical} />
                        </span>
                    </Dropdown>
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
                    {data.tags &&
                        data.tags.map((item, index) => (
                            <span key={index} className={cx('tag')}>
                                #{item.name}
                            </span>
                        ))}

                    {data.sharedPost && <SharedPost data={data.sharedPost} />}

                    <div className={cx('interact')}>
                        <Button
                            className={isLiked ? cx('buttonLiked') : ''}
                            leftIcon={<FontAwesomeIcon icon={faThumbsUp} />}
                            onClick={() => {
                                handeLikeClick();
                            }}
                        >
                            {data.likes.length || 0}
                        </Button>
                        <Button
                            leftIcon={<FontAwesomeIcon icon={faMessage} />}
                            onClick={() => {
                                dispatch(openModal({ name: 'postDetail', data: data.id }));
                            }}
                            disabled={commentDisabled}
                        >
                            {data.commentCount || 0}
                        </Button>
                        <Button
                            leftIcon={<FontAwesomeIcon icon={faShare} />}
                            onClick={() => {
                                dispatch(openModal({ name: 'post', type: 'share', data }));
                            }}
                        >
                            {data.sharedCount}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Post;
