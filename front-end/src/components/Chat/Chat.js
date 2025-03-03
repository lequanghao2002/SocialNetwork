import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Chat.module.scss';
import Image from '../Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCamera,
    faCircleInfo,
    faFaceSmile,
    faImage,
    faMicrophone,
    faPhone,
    faVideo,
} from '@fortawesome/free-solid-svg-icons';
import Button from '../Button';
import EmojiPicker from 'emoji-picker-react';
import { useContext } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import AuthContext from '~/context/AuthContext/authContext';
import ChatContext from '~/context/ChatContext/chatContext';
import { chatHubService } from '~/signalR/chatHubService';
import messageService from '~/services/messageService';

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

    const { selectedFriendId, setMessage, setChat, friends } = useContext(ChatContext);
    const { user } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const [img, setImg] = useState({
        file: null,
        url: '',
    });

    const selectedFriend = useMemo(() => {
        if (!Array.isArray(friends) || !selectedFriendId) return null;
        return friends.find((friend) => friend.info.id === selectedFriendId);
    }, [friends, selectedFriendId]);

    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedFriend?.chat]);

    useEffect(() => {
        if (!selectedFriendId || !user?.Id) return;
        if (selectedFriend?.chat?.length > 0) return;

        fetchChat(user.Id, selectedFriendId);
    }, [selectedFriendId]);
    //}, [user?.Id, selectedFriendId, selectedFriend?.chat]); // Cập nhật dependencies đầy đủ

    const fetchChat = async (userId, ortherUserId) => {
        try {
            const result = await messageService.getMessagesByUserId(userId, ortherUserId);
            console.log('result', result);
            setChat(result);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        }
    };

    const handleImg = (e) => {
        if (e.target.files[0]) {
            setImg({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0]),
            });
        }
    };

    const handleClickEmoji = (e) => {
        setMessage({
            content: (selectedFriend?.message?.content || '') + e.emoji,
            imageUrl: null,
        });
        setOpen(false);
    };

    const handleSend = async () => {
        if (!selectedFriend?.message?.content) return;

        const message = {
            senderId: user.Id,
            receiverId: selectedFriend.info.id,
            content: selectedFriend.message.content,
            imageUrl: null,
        };

        try {
            await chatHubService.sendMessage(message);
            setMessage({ content: '', imageUrl: null });
        } catch (err) {
            console.error('Lỗi gửi tin nhắn: ', err);
        }

        endRef.current?.scrollIntoView({ behavior: 'smooth' });
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
                            <div key={message?.id} className={cx('message', message.senderId === user.Id ? 'own' : '')}>
                                <div className={cx('texts')}>
                                    {message.imageUrl && (
                                        <img
                                            src={message.imageUrl}
                                            alt=""
                                            style={{ borderRadius: '8px', width: '100%' }}
                                        />
                                    )}
                                    <p>{message.content}</p>
                                    <span>{dayjs(message.createAt).utc().utcOffset(7).fromNow()}</span>
                                </div>
                            </div>
                        ))}

                        {img.url && (
                            <div className={cx('message', 'own')}>
                                <div className={cx('texts')}>
                                    <img src={img.url} alt="" />
                                </div>
                            </div>
                        )}

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
                    onChange={(e) => setMessage({ content: e.target.value, imageUrl: null })}
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
                    onClick={handleSend}
                    disabled={isCurrentUserBlocked || isReceiverBlocked}
                    style={{
                        cursor: isCurrentUserBlocked || isReceiverBlocked ? 'not-allowed' : 'pointer',
                    }}
                >
                    Send
                </Button>
            </div>
        </div>
    );
}

export default Chat;
