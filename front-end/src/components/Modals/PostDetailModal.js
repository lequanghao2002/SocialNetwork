import { Form, Input, Modal, message } from 'antd';
import './PostDetailModal.scss';
import Post from '../Post';
import Image from '../Image';
import Button from '../Button';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faFaceSmile, faImage, faMicrophone, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useContext, useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import * as commentService from '~/services/commentService';
import { AppContext, AuthContext, NotificationContext } from '~/context';
import Comment from '../Comment/Comment';

dayjs.extend(relativeTime);
dayjs.extend(utc);

function PostDetailModal({
    visible,
    setVisible,
    onClose,
    post,
    handlePostSubmit,
    handleDeletePost,
    handleLikeChange,
    posts,
    setPosts,
}) {
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');
    const { user } = useContext(AuthContext);
    const { success, error } = useContext(NotificationContext);
    const [loading, setLoading] = useState(false);

    const handleClickEmoji = (e) => {
        setText((prev) => prev + e.emoji);
        setOpen(false);
    };

    const handleSendComment = async () => {
        setLoading(true);
        const data = {
            userId: user.Id,
            postId: post.id,
            content: text,
        };
        const result = await commentService.addComment(data);
        if (result != null) {
            console.log(result);
            setText('');
            const updatedPosts = posts.map((post) => (post.id === result.id ? result : post));
            console.log(updatedPosts);
            setPosts(updatedPosts);
            success('Comment success');
            setLoading(false);
        } else {
            setLoading(false);
            error('Comment error');
            console.error('comment error');
        }
    };

    const renderComments = (comments, parentId = null) => {
        return comments
            .filter((comment) => comment.parentId === parentId)
            .map((comment) => (
                <div key={comment.id}>
                    <div className="item-comment">
                        <Comment item={comment} postId={post.id} posts={posts} setPosts={setPosts} />
                    </div>
                    <div style={{ marginLeft: '30px' }}>{renderComments(comments, comment.id)}</div>
                </div>
            ));
    };

    return (
        <>
            <Modal
                width={1000}
                open={visible}
                footer={null}
                onCancel={onClose}
                maskClosable={false}
                style={{ top: 20 }}
            >
                <div className="wrapper">
                    {loading && (
                        <div className="loading-overlay">
                            <FontAwesomeIcon icon={faSpinner} className="search-loading" />
                        </div>
                    )}
                    <Post
                        data={post}
                        handlePostSubmit={handlePostSubmit}
                        handleDeletePost={handleDeletePost}
                        handleLikeChange={handleLikeChange}
                        disableActionButton={true}
                    />

                    <div className="list-comment">{post?.comments?.length > 0 && renderComments(post.comments)}</div>

                    <div className="bottom">
                        <div className="icons">
                            <FontAwesomeIcon icon={faImage} />
                            <FontAwesomeIcon icon={faCamera} />
                            <FontAwesomeIcon icon={faMicrophone} />
                        </div>
                        <input
                            className="input-send"
                            type="text"
                            placeholder="Type a message..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <div className="emoji">
                            <FontAwesomeIcon icon={faFaceSmile} onClick={() => setOpen((prev) => !prev)} />
                            <div className="picker">
                                <EmojiPicker open={open} onEmojiClick={handleClickEmoji} theme="dark" />
                            </div>
                        </div>
                        <Button primary small onClick={handleSendComment}>
                            Send
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default PostDetailModal;
