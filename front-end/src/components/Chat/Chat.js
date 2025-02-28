import React, { useEffect, useRef, useState } from 'react';
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
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '~/firebase/config';
import { useContext } from 'react';
import { ChatContext } from '~/context/ChatProvider';
import { message } from 'antd';
import upload from '~/firebase/upload';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import AuthContext from '~/context/AuthContext/authContext';

dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.extend(utc);
const cx = classNames.bind(styles);

const format = 'MMMM D, YYYY [at] h:mm:ss A [UTC]Z';

function Chat() {
    const { user, chatId, isReceiverBlocked, isCurrentUserBlocked } = useContext(ChatContext);
    const { user: currentUser } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const [chat, setChat] = useState();
    const [text, setText] = useState('');
    const [img, setImg] = useState({
        file: null,
        url: '',
    });

    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        const unSub = onSnapshot(doc(db, 'chats', chatId), (res) => {
            setChat(res.data());
        });

        return () => {
            unSub();
        };
    }, [chatId]);

    const handleImg = (e) => {
        if (e.target.files[0]) {
            setImg({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0]),
            });
        }
    };

    const handleClickEmoji = (e) => {
        setText((prev) => prev + e.emoji);
        setOpen(false);
    };

    const handleSend = async () => {
        if (text === '') return;

        let imgUrl = null;

        try {
            if (img.file) {
                imgUrl = await upload(img.file);
            }

            await updateDoc(doc(db, 'chats', chatId), {
                message: arrayUnion({
                    senderId: currentUser.Uid,
                    text,
                    createAt: new Date().toISOString(),
                    ...(imgUrl && { img: imgUrl }),
                }),
            });

            const userIDs = [currentUser.Uid, user.id];

            userIDs.forEach(async (id) => {
                const userChatsRef = doc(db, 'userchats', id);
                const userChatsSnapshot = await getDoc(userChatsRef);

                if (userChatsSnapshot.exists()) {
                    const userChatsData = userChatsSnapshot.data();

                    const chatIndex = userChatsData.chats.findIndex((c) => c.chatId === chatId);
                    userChatsData.chats[chatIndex].lastMessage = text;
                    userChatsData.chats[chatIndex].isSeen = id === currentUser.Uid ? true : false;
                    userChatsData.chats[chatIndex].updatedAt = Date.now();

                    await updateDoc(userChatsRef, {
                        chats: userChatsData.chats,
                    });
                }
            });
        } catch (err) {
            console.log(err);
        }

        setImg({
            file: null,
            url: '',
        });

        setText('');

        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('top')}>
                <div className={cx('user')}>
                    <Image src={user?.avatar} alt="" className={cx('img')} />
                    <div className={cx('info')}>
                        <span>{user?.username}</span>
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
                {chat?.message?.map((message) => (
                    <div
                        key={message?.createAt}
                        className={cx('message', message.senderId === currentUser.Uid ? 'own' : '')}
                    >
                        <div className={cx('texts')}>
                            {message.img && (
                                <img src={message.img} alt="" style={{ borderRadius: '8px', width: '100%' }} />
                            )}
                            <p>{message.text}</p>
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
                    value={text}
                    onChange={(e) => setText(e.target.value)}
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
