import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from '../Image';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { useContext, useState } from 'react';
import { AppContext, AuthContext, NotificationContext } from '~/context';
import { faCamera, faFaceSmile, faImage, faMicrophone, faSpinner } from '@fortawesome/free-solid-svg-icons';
import EmojiPicker from 'emoji-picker-react';
import Button from '../Button';
import * as commentService from '~/services/commentService';
import { message } from 'antd';

dayjs.extend(relativeTime);
dayjs.extend(utc);

function Comment({ item, postId }) {
    const { user } = useContext(AuthContext);
    const [relyMode, setRelyMode] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');
    const { posts, setPosts } = useContext(AppContext);
    const { success, error } = useContext(NotificationContext);
    const [loading, setLoading] = useState(false);

    const handleClickEmoji = (e) => {
        setText((prev) => prev + e.emoji);
        setOpen(false);
    };

    const handleRelyComment = async () => {
        setLoading(true);
        const data = {
            userId: user.Id,
            postId: postId,
            content: text,
            parentId: item.id,
        };
        const result = await commentService.addComment(data);
        if (result != null) {
            setText('');
            const updatedPosts = posts.map((post) => (post.id === result.id ? result : post));
            setPosts(updatedPosts);
            setLoading(false);
            success('Rely comment success');
        } else {
            error('Rely comment error');
        }
    };

    const handleUpdateComment = async () => {
        setLoading(true);
        const data = {
            id: item.id,
            content: text,
        };
        const result = await commentService.updateComment(data);
        if (result != null) {
            setText('');
            setEditMode(false);
            const updatedPosts = posts.map((post) => (post.id === result.id ? result : post));
            setPosts(updatedPosts);
            setLoading(false);
            success('Update comment success');
        } else {
            error('Update comment error');
        }
    };

    const handleDeleteComment = async (Id) => {
        setLoading(true);
        const result = await commentService.deleteComment(Id);
        if (result != null) {
            setText('');
            const updatedPosts = posts.map((post) => (post.id === result.id ? result : post));
            setPosts(updatedPosts);
            setLoading(false);
            success('Delete comment success');
        } else {
            error('Delete comment error');
        }
    };

    return (
        <>
            {loading && (
                <div className="loading-overlay">
                    <FontAwesomeIcon icon={faSpinner} className="search-loading" />
                </div>
            )}
            <Image src={item.user?.avatarUrl} />
            <div>
                <div className="user-info">
                    <span className="full-name">{`${item.user?.firstName} ${item.user?.lastName}`}</span>
                    <span className="comment">{item.content}</span>
                </div>

                <div className="rely">
                    <span className="hour">{dayjs(item.createdDate).local().fromNow()}</span>
                    {item.user?.id !== user.Id ? (
                        relyMode ? (
                            <div
                                className="bottom"
                                style={{
                                    gap: 5,
                                    marginTop: 0,
                                    borderTop: 'none',
                                    paddingTop: '5px',
                                    height: '40px',
                                    alignItems: 'center',
                                }}
                            >
                                <input
                                    style={{ minWidth: '300px' }}
                                    className="input-send"
                                    type="text"
                                    placeholder="Type a message..."
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                />
                                <div className="emoji">
                                    <FontAwesomeIcon icon={faFaceSmile} onClick={() => setOpen((prev) => !prev)} />
                                    <div className="picker" style={{ bottom: 'auto', right: 0, left: 'auto' }}>
                                        <EmojiPicker open={open} onEmojiClick={handleClickEmoji} theme="dark" />
                                    </div>
                                </div>
                                <Button primary small onClick={() => handleRelyComment()}>
                                    Rely
                                </Button>
                                <Button small onClick={() => setRelyMode(false)}>
                                    Cancel
                                </Button>
                            </div>
                        ) : (
                            <span className="btn-reply" onClick={() => setRelyMode(true)}>
                                reply
                            </span>
                        )
                    ) : (
                        <>
                            {editMode ? (
                                <div
                                    className="bottom"
                                    style={{
                                        gap: 5,
                                        marginTop: 0,
                                        borderTop: 'none',
                                        paddingTop: '5px',
                                        height: '40px',
                                        alignItems: 'center',
                                    }}
                                >
                                    <input
                                        style={{ minWidth: '300px' }}
                                        className="input-send"
                                        type="text"
                                        placeholder="Type a message..."
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                    />
                                    <div className="emoji">
                                        <FontAwesomeIcon icon={faFaceSmile} onClick={() => setOpen((prev) => !prev)} />
                                        <div className="picker" style={{ bottom: 'auto', right: 0, left: 'auto' }}>
                                            <EmojiPicker open={open} onEmojiClick={handleClickEmoji} theme="dark" />
                                        </div>
                                    </div>
                                    <Button primary small onClick={() => handleUpdateComment()}>
                                        Update
                                    </Button>
                                    <Button small onClick={() => setEditMode(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            ) : (
                                <span
                                    text
                                    className="btn-update"
                                    onClick={() => {
                                        setEditMode(true);
                                        setText(item.content);
                                    }}
                                >
                                    update
                                </span>
                            )}
                            <span
                                text
                                className="btn-remove"
                                onClick={() => {
                                    handleDeleteComment(item.id);
                                }}
                            >
                                delete
                            </span>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default Comment;
