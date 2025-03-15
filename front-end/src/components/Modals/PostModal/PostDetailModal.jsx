import { Modal } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faFaceSmile, faImage, faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { useCallback, useEffect, useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingModal from '../LoadingModal/LoadingModal';
import { postDetailLoadingSelector, postDetailModalSelector } from '~/features/modal/modalSelector';
import Post from '~/components/Post/Post';
import Comment from '~/components/Comment/Comment';
import Button from '~/components/Button';
import { closeModal, setLoading } from '~/features/modal/modalSlice';
import { postsSelector } from '~/features/post/postSelector';
import { uploadCommentImage } from '~/utils/uploadHelper';
import styles from './PostDetailModal.module.scss';
import classNames from 'classnames/bind';
import commentHubService from '~/sockets/commentHubService';
import { fetchCommentsThunk } from '~/features/post/postThunk';
import { addComment, deleteComment, updateComment } from '~/features/post/postSlice';
import { useMessage } from '~/context/MessageProvider';

const cx = classNames.bind(styles);

function PostDetailModal() {
    const dispatch = useDispatch();
    const posts = useSelector(postsSelector);
    const postDetailModal = useSelector(postDetailModalSelector);
    const loading = useSelector(postDetailLoadingSelector);

    const post = posts.find((p) => p.id === postDetailModal.data);

    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');
    const { success, error } = useMessage();

    useEffect(() => {
        if (!postDetailModal.isOpen || !post) return;

        dispatch(fetchCommentsThunk(post.id));

        commentHubService.joinPostGroup(post.id);

        commentHubService.onCommentChanged((payload) => {
            const { eventType, data } = payload;
            switch (eventType) {
                case 'created':
                    dispatch(addComment(data));
                    break;
                case 'updated':
                    dispatch(updateComment(data));
                    break;
                case 'deleted':
                    dispatch(deleteComment(data));
                    break;
                default:
                    break;
            }
        });

        return () => {
            commentHubService.leavePostGroup(post.id);
            commentHubService.offCommentChanged();
        };
    }, [postDetailModal.isOpen, post?.id]);

    const handleImg = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const downloadURL = await uploadCommentImage(file);

            if (!downloadURL) {
                error('Update image failed');
                return;
            }

            const comment = {
                postId: post.id,
                content: '',
                imageUrl: downloadURL,
                parentId: null,
            };

            await commentHubService.addComment(comment);
            success('Send comment successfully');
        } catch (err) {
            error('Send comment failed');
            console.error('Lỗi upload ảnh hoặc gửi tin nhắn:', err);
        }
    };

    const handleClickEmoji = (e) => {
        setText((prev) => prev + e.emoji);
        setOpen(false);
    };

    const handleSendComment = async () => {
        if (!text.trim()) return;

        dispatch(setLoading({ name: 'postDetail', isLoading: true }));

        const comment = {
            postId: post.id,
            content: text.trim(),
            imageUrl: null,
            parentId: null,
        };

        try {
            await commentHubService.addComment(comment);
            success('Send comment successfully');
            setText('');
        } catch (err) {
            error('Send comment failed');
            console.error('error comment: ', err);
        } finally {
            dispatch(setLoading({ name: 'postDetail', isLoading: false }));
        }
    };

    const renderComments = useCallback(() => {
        if (!post?.comments?.length) return null;

        // Lưu thông tin cha để có thể gán parentName
        const commentUserMap = new Map();
        post.comments.forEach((comment) => {
            commentUserMap.set(comment.id, comment.user);
        });

        const commentMap = new Map();
        post.comments.forEach((comment) => {
            const parentId = comment.parentId || 'root';

            // Gán parentName nếu có cha
            const parentUser = parentId !== 'root' ? commentUserMap.get(parentId) || null : null;

            if (!commentMap.has(parentId)) {
                commentMap.set(parentId, []);
            }

            commentMap.get(parentId).push({ ...comment, parentUser });
        });

        const renderCommentTree = (parentId = 'root', depth = 0) => {
            if (!commentMap.has(parentId)) return null;

            return commentMap.get(parentId).map((comment) => (
                <div key={comment.id}>
                    <Comment data={comment} postId={post.id} />
                    <div style={{ marginLeft: depth < 2 ? '45px' : 0 }}>{renderCommentTree(comment.id, depth + 1)}</div>
                </div>
            ));
        };

        return renderCommentTree();
    }, [post?.id, post?.comments]);

    return (
        <>
            <Modal
                width={800}
                open={postDetailModal.isOpen}
                footer={null}
                onCancel={() => {
                    dispatch(closeModal('postDetail'));
                }}
                maskClosable={false}
                style={{ top: 20 }}
                closable={!loading}
            >
                <div className={cx('wrapper')}>
                    {post && (
                        <h2 className="title-post">
                            Bài viết của {post.user.firstName} {post.user.lastName}
                        </h2>
                    )}

                    {loading && <LoadingModal title="" />}

                    <div className={cx('content')}>
                        <div style={{ marginTop: '-18px' }}>
                            <Post data={post} commentDisabled={true} />
                        </div>

                        <div className={cx('list-comment')}>{renderComments()}</div>
                    </div>

                    <div className={cx('bottom')}>
                        <div className={cx('icons')}>
                            <label htmlFor="file">
                                <FontAwesomeIcon icon={faImage} />
                            </label>
                            <input
                                className={cx('input-text')}
                                type="file"
                                accept="image/*"
                                id="file"
                                style={{ display: 'none' }}
                                onChange={handleImg}
                            />
                            <FontAwesomeIcon icon={faCamera} onClick={() => alert('Coming soon')} />
                            <FontAwesomeIcon icon={faMicrophone} onClick={() => alert('Coming soon')} />
                        </div>
                        <input
                            className={cx('input-send')}
                            type="text"
                            placeholder="Type a message..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <div className={cx('"emoji"')}>
                            <FontAwesomeIcon icon={faFaceSmile} onClick={() => setOpen((prev) => !prev)} />
                            <div className={cx('picker')}>
                                <EmojiPicker open={open} onEmojiClick={handleClickEmoji} theme="dark" />
                            </div>
                        </div>
                        <Button primary small onClick={handleSendComment} disabled={!text.trim()}>
                            Send
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default PostDetailModal;
