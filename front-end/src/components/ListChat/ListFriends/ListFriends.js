import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ListFriends.module.scss';
import Image from '~/components/Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faPenToSquare, faPlus, faPlusSquare, faSearch, faVideo } from '@fortawesome/free-solid-svg-icons';
import AuthContext from '~/context/AuthContext/authContext';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '~/firebase/config';
import { ChatContext } from '~/context/ChatProvider';

const cx = classNames.bind(styles);

function ListFriends() {
    const { user } = useContext(AuthContext);
    const { chatId, changeChat } = useContext(ChatContext);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState();

    useEffect(() => {
        if (!user?.Uid) return;

        const unSub = onSnapshot(doc(db, 'userchats', user.Uid), async (res) => {
            const items = res.data().chats || [];

            const promises = items.map(async (item) => {
                const userDocRef = doc(db, 'users', item.receiverId);
                const userDocSnap = await getDoc(userDocRef);

                const user = userDocSnap.data();

                return { ...item, user };
            });

            const chatData = await Promise.all(promises);
            setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
        });

        return () => {
            unSub();
        };
    }, [user.Uid]);

    const handleSelect = async (chat) => {
        setSelectedChat(chat);
        const userChats = chats.map((item) => {
            const { user, ...rest } = item;

            return rest;
        });

        const chatIndex = userChats.findIndex((item) => item.chatId === chat.chatId);
        userChats[chatIndex].isSeen = true;

        const userChatsRef = doc(db, 'userchats', user.Uid);
        try {
            await updateDoc(userChatsRef, {
                chats: userChats,
            });
            changeChat(chat.chatId, chat.user);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className={cx('wrapper')}>
            {chats?.map((chat) => (
                <div
                    style={{ backgroundColor: chat.isSeen ? '' : '#f18404' }}
                    key={chat.chatId}
                    className={cx('item', {
                        active: chat === selectedChat,
                    })}
                    onClick={() => handleSelect(chat)}
                >
                    <Image src={chat.user.avatar} alt="" className={cx('img')} />
                    <div className={cx('info')}>
                        <span>{chat.user.username}</span>
                        <p>{chat.lastMessage}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ListFriends;
