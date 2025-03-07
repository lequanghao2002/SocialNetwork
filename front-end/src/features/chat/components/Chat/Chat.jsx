import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Chat.module.scss';
import Image from '../../../../components/Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCamera,
    faCircleInfo,
    faEllipsisVertical,
    faFaceSmile,
    faImage,
    faMicrophone,
    faPhone,
    faVideo,
} from '@fortawesome/free-solid-svg-icons';
import Button from '../../../../components/Button';
import EmojiPicker from 'emoji-picker-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { chatHubService } from '~/sockets/chatHubService';
import messageService from '~/services/messageService';
import { uploadChatImage } from '~/utils/uploadHelper';
import { Dropdown, Flex } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { friendsSelector, selectedFriendIdSelector } from '~/features/chat/chatSelectors';
import { setChat, setMessage } from '~/features/chat/chatSlice';
import { userSelector } from '~/features/auth/authSelector';

dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.extend(utc);
const cx = classNames.bind(styles);

const format = 'MMMM D, YYYY [at] h:mm:ss A [UTC]Z';

function Chat() {
    //const { user, chatId, isReceiverBlocked, isCurrentUserBlocked } = useContext(ChatContext);
    //------------- Để tạm thời, mình sẽ hard code giá trị cho các biến này ------------\
    const isReceiverBlocked = false;
    const isCurrentUserBlocked = false;
    //-------------

    const dispatch = useDispatch();
    const friends = useSelector(friendsSelector);
    const selectedFriendId = useSelector(selectedFriendIdSelector);

    const user = useSelector(userSelector);
    const [open, setOpen] = useState(false);
    const [typeInput, setTypeInput] = useState('add'); // add, update
    const [selectedMessageId, setSelectedMessageId] = useState(null);
    const endRef = useRef(null);

    const selectedFriend = useMemo(() => {
        if (!Array.isArray(friends) || !selectedFriendId) return null;
        return friends.find((friend) => friend.info.id === selectedFriendId);
    }, [friends, selectedFriendId]);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedFriend?.chat]);

    useEffect(() => {
        if (!selectedFriendId || !user.id) return;
        if (selectedFriend?.chat?.length > 0) return;

        fetchChat(user.id, selectedFriendId);
    }, [selectedFriendId]);

    const fetchChat = async (userId, ortherUserId) => {
        try {
            const result = await messageService.getMessagesByUserId(userId, ortherUserId);
            dispatch(setChat(result));
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        }
    };

    const handleImg = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const downloadURL = await uploadChatImage(file);

            if (!downloadURL) return;

            const message = {
                senderId: user.id,
                receiverId: selectedFriend.info.id,
                content: '',
                imageUrl: downloadURL,
            };

            await chatHubService.sendMessage(message);
        } catch (err) {
            console.error('Lỗi upload ảnh hoặc gửi tin nhắn:', err);
        }
    };

    const handleClickEmoji = (e) => {
        dispatch(
            setMessage({
                content: (selectedFriend?.message?.content || '') + e.emoji,
                imageUrl: null,
            }),
        );
        setOpen(false);
    };

    const handleSend = async () => {
        if (!selectedFriend?.message?.content) return;

        const message = {
            senderId: user.id,
            receiverId: selectedFriend.info.id,
            content: selectedFriend.message.content,
            imageUrl: null,
        };

        try {
            await chatHubService.sendMessage(message);
            dispatch(setMessage({ content: '', imageUrl: null }));
        } catch (err) {
            console.error('Lỗi gửi tin nhắn: ', err);
        }

        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSave = async () => {
        if (!selectedFriend?.message?.content) return;

        const message = {
            id: selectedMessageId,
            content: selectedFriend.message.content,
        };

        try {
            await chatHubService.updateMessage(message);
            dispatch(setMessage({ content: '', imageUrl: null }));

            setSelectedMessageId(null);
            setTypeInput('add');
        } catch (err) {
            console.error('Lỗi update tin nhắn: ', err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await chatHubService.deleteMessage(id);
        } catch (err) {
            console.error('Lỗi update tin nhắn: ', err);
        }
    };

    return (
        <div className={cx('wrapper')}>
            {selectedFriend && (
                <>
                    <div className={cx('top')}>
                        <div className={cx('user')}>
                            <Image src={selectedFriend.info.avatarUrl} alt="" className={cx('img')} />
                            <div className={cx('info')}>
                                <span>
                                    {selectedFriend.info.firstName} {selectedFriend.info.lastName}
                                </span>
                                {/* <p>Hello workkkkkkkkkkkkkkkkkkkkkkkkk</p> */}
                            </div>
                        </div>
                        <div className={cx('icons')}>
                            <FontAwesomeIcon icon={faPhone} />
                            <FontAwesomeIcon icon={faVideo} />
                            <FontAwesomeIcon icon={faCircleInfo} />
                        </div>
                    </div>

                    <div className={cx('center')}>
                        {selectedFriend.chat?.map((message) => (
                            <div key={message?.id} className={cx('message', message.senderId === user.id ? 'own' : '')}>
                                <div className={cx('texts')}>
                                    <Flex align="center" gap={12}>
                                        {message.senderId === user.id && !message.deleted && (
                                            <Dropdown
                                                menu={{
                                                    items: [
                                                        {
                                                            key: 'update',
                                                            label: 'Update',
                                                            disabled: message.imageUrl,
                                                        },
                                                        {
                                                            key: 'delete',
                                                            label: 'Delete',
                                                        },
                                                    ],
                                                    onClick: ({ key }) => {
                                                        if (key === 'update') {
                                                            setTypeInput('update');
                                                            dispatch(
                                                                setMessage({ content: message.content, imageUrl: '' }),
                                                            );
                                                            setSelectedMessageId(message.id);
                                                        } else if (key === 'delete') {
                                                            handleDelete(message.id);
                                                        }
                                                    },
                                                }}
                                                placement="top"
                                            >
                                                <FontAwesomeIcon icon={faEllipsisVertical} />
                                            </Dropdown>
                                        )}

                                        {message.deleted ? (
                                            message.imageUrl ? (
                                                <p style={{ flex: 1 }}>This image has been deleted.</p>
                                            ) : (
                                                <p style={{ flex: 1 }}>This message has been deleted.</p>
                                            )
                                        ) : message.imageUrl ? (
                                            <img
                                                src={message.imageUrl}
                                                alt="Sent image"
                                                style={{ borderRadius: '8px', width: '100%' }}
                                            />
                                        ) : (
                                            <p style={{ flex: 1 }}>{message.content}</p>
                                        )}

                                        {/* Thực hiện logic của người nhận
                                        {message.receiverId === user.id} */}
                                    </Flex>
                                    <span>{dayjs(message.createdDate).utc().utcOffset(7).fromNow()}</span>
                                </div>
                            </div>
                        ))}

                        <div ref={endRef}></div>
                    </div>
                </>
            )}

            <div className={cx('bottom')}>
                <div className={cx('icons')}>
                    <label htmlFor="file">
                        <FontAwesomeIcon icon={faImage} />
                    </label>
                    <input
                        className={cx('input-text')}
                        type="file"
                        id="file"
                        style={{ display: 'none' }}
                        onChange={handleImg}
                        disabled={isCurrentUserBlocked || isReceiverBlocked}
                    />
                    <FontAwesomeIcon icon={faCamera} />
                    <FontAwesomeIcon icon={faMicrophone} />
                </div>
                <input
                    className={cx('input-send')}
                    type="text"
                    placeholder="Type a message..."
                    value={selectedFriend?.message?.content}
                    onChange={(e) => dispatch(setMessage({ content: e.target.value, imageUrl: null }))}
                    disabled={isCurrentUserBlocked || isReceiverBlocked}
                    style={{
                        cursor: isCurrentUserBlocked || isReceiverBlocked ? 'not-allowed' : 'auto',
                    }}
                />
                <div className={cx('emoji')}>
                    <FontAwesomeIcon icon={faFaceSmile} onClick={() => setOpen((prev) => !prev)} />
                    <div className={cx('picker')}>
                        <EmojiPicker open={open} onEmojiClick={handleClickEmoji} theme="dark" />
                    </div>
                </div>
                <Button
                    className={cx('send-btn')}
                    primary
                    small
                    onClick={typeInput === 'add' ? handleSend : handleSave}
                    disabled={isCurrentUserBlocked || isReceiverBlocked}
                    style={{
                        cursor: isCurrentUserBlocked || isReceiverBlocked ? 'not-allowed' : 'pointer',
                    }}
                >
                    {typeInput === 'add' ? 'Send' : 'Save'}
                </Button>
            </div>
        </div>
    );
}

export default Chat;
