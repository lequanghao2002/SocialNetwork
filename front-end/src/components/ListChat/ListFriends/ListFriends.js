import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ListFriends.module.scss';
import Image from '~/components/Image';
import { faEllipsis, faPenToSquare, faPlus, faPlusSquare, faSearch, faVideo } from '@fortawesome/free-solid-svg-icons';
import AuthContext from '~/context/AuthContext/authContext';
import userService from '~/services/userService';
import ChatContext from '~/context/ChatContext/chatContext';

const cx = classNames.bind(styles);

function ListFriends() {
    const { user } = useContext(AuthContext);
    const { setSelectedFriendId, friends, setFriends, selectedFriendId } = useContext(ChatContext);

    useEffect(() => {
        fetchListFriendship(user.Id);
    }, []);

    const fetchListFriendship = async (Id) => {
        try {
            const result = await userService.getListFriendship(Id);
            setFriends(result);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        }
    };

    const handleSelect = async (id) => {
        if (selectedFriendId === id) return;

        setSelectedFriendId(id);
    };

    return (
        <div className={cx('wrapper')}>
            {friends?.map((friend) => (
                <div
                    //style={{ backgroundColor: chat.isSeen ? '' : '#f18404' }}
                    key={friend.Id}
                    className={cx('item', {
                        active: friend.info.id === selectedFriendId,
                    })}
                    onClick={() => handleSelect(friend.info.id)}
                >
                    <Image src={friend.info.avatarUrl} alt="" className={cx('img')} />
                    <div className={cx('info')}>
                        <span>
                            {friend.info.firstName} {friend.info.lastName}
                        </span>
                        {/* <p>{friend.lastMessage}</p> */}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ListFriends;
