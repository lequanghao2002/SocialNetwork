import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { Button, Dropdown, Flex, Image, Modal, Tooltip } from 'antd';
import Avatar from '../Image';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector } from '~/features/auth/authSelector';
import { dateFormat } from '~/utils/dateFormat';
import TextEllipsis from '../Text/TextEllipsis';
import styles from './Comment.module.scss';
import classNames from 'classnames/bind';
import CommentInput from '../Input/CommentInput';
import commentHubService from '~/sockets/commentHubService';
import { useMessage } from '~/context/MessageProvider';
import { uploadCommentImage } from '~/utils/uploadHelper';
import { setLoading } from '~/features/modal/modalSlice';

const cx = classNames.bind(styles);

function Comment({ data, postId }) {
    const dispatch = useDispatch();
    const user = useSelector(userSelector);
    const { success, error } = useMessage();

    const [mode, setMode] = useState({});

    const handleImg = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        dispatch(setLoading({ name: 'postDetail', isLoading: true }));
        try {
            const downloadURL = await uploadCommentImage(file);

            if (!downloadURL) {
                error('Update image failed');
                return;
            }

            if (mode.type === 'update') {
                const comment = {
                    id: data.id,
                    imageUrl: downloadURL,
                };
                await commentHubService.updateComment(comment);
                success('Send comment successfully');
            } else if (mode.type === 'reply') {
                const comment = {
                    postId: postId,
                    imageUrl: downloadURL,
                    parentId: data.id,
                };
                await commentHubService.addComment(comment);
                success('Send comment successfully');
            }
        } catch (err) {
            error(mode.type === 'update' ? 'Update comment failed' : 'Reply comment failed');
            console.error('Lỗi upload ảnh hoặc gửi tin nhắn:', err);
        } finally {
            setMode({});
            dispatch(setLoading({ name: 'postDetail', isLoading: false }));
        }
    };

    const handleRelyComment = async (text) => {
        if (!text.trim()) return;

        dispatch(setLoading({ name: 'postDetail', isLoading: true }));
        const comment = {
            postId: postId,
            content: text.trim(),
            imageUrl: null,
            parentId: data.id,
        };

        try {
            await commentHubService.addComment(comment);
            success('Rely comment successfully');
        } catch (err) {
            error('Rely comment failed');
            console.error('error comment: ', err);
        } finally {
            setMode({});
            dispatch(setLoading({ name: 'postDetail', isLoading: false }));
        }
    };

    const handleUpdateComment = async (text) => {
        if (!text.trim()) return;

        dispatch(setLoading({ name: 'postDetail', isLoading: true }));
        const comment = {
            id: data.id,
            content: text.trim(),
        };

        try {
            await commentHubService.updateComment(comment);
            success('Update comment successfully');
        } catch (err) {
            error('Update comment failed');
            console.error('error comment: ', err);
        } finally {
            setMode({});
            dispatch(setLoading({ name: 'postDetail', isLoading: false }));
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await commentHubService.deleteComment(commentId);
            success('Delete comment successfully');
        } catch (err) {
            error('Delete comment failed');
            console.error('error comment: ', err);
        }
    };

    return (
        <>
            <Flex gap={12}>
                <Avatar src={data.user?.avatarUrl} />

                <Flex gap={12} align="center">
                    <div className={cx('user-info')}>
                        <span className={cx('full-name')}>{`${data.user?.firstName} ${data.user?.lastName}`}</span>
                        <Flex>
                            {data.parentId != null && data.user.id != data.parentUser.id && (
                                <span style={{ color: 'yellow' }}>
                                    {`${data.parentUser.firstName} ${data.parentUser.lastName}`}
                                    <span>&nbsp;</span>
                                </span>
                            )}

                            {data.content && <TextEllipsis lines={2}>{data.content}</TextEllipsis>}
                        </Flex>

                        {data.imageUrl && <Image src={data.imageUrl} width={100} />}
                    </div>

                    {user.id === data.user.id && (
                        <Dropdown
                            menu={{
                                items: [
                                    ...(!data.imageUrl
                                        ? [
                                              {
                                                  key: 'update',
                                                  label: 'Update',
                                              },
                                          ]
                                        : []),
                                    {
                                        key: 'delete',
                                        label: 'Delete',
                                    },
                                ],
                                onClick: ({ key }) => {
                                    if (key === 'update') {
                                        setMode({ type: 'update' });
                                    } else if (key === 'delete') {
                                        Modal.confirm({
                                            title: 'Are you sure you want to delete this comment?',
                                            content: 'This action cannot be undone.',
                                            className: 'custom-dark-modal',
                                            okText: 'Yes',
                                            cancelText: 'Cancel',
                                            onOk: () => handleDeleteComment(data.id),
                                        });
                                    }
                                },
                            }}
                            placement="top"
                        >
                            <FontAwesomeIcon style={{ cursor: 'pointer' }} icon={faEllipsisVertical} />
                        </Dropdown>
                    )}
                </Flex>
            </Flex>

            <div className={cx('comment-footer')}>
                <span className={cx('hour')}>
                    <Tooltip title={dateFormat.fullDateTime(data.createdDate)} placement="bottom">
                        {dateFormat.timeFromNow(data.createdDate)}
                    </Tooltip>
                </span>

                <Button type="link" onClick={() => setMode({ type: 'reply' })}>
                    reply
                </Button>

                <div>
                    {mode.type === 'reply' && (
                        <CommentInput
                            onSubmit={handleRelyComment}
                            onHandleImg={handleImg}
                            onCancel={() => setMode({})}
                            submitText="Reply"
                        />
                    )}
                    {mode.type === 'update' && (
                        <CommentInput
                            initialText={data.content}
                            onSubmit={handleUpdateComment}
                            onHandleImg={handleImg}
                            onCancel={() => setMode({})}
                            submitText="Update"
                        />
                    )}
                </div>
            </div>
        </>
    );
}

export default Comment;
