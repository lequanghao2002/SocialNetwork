import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ListFriends.module.scss';
import Image from '~/components/Image';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import AuthContext from '~/context/AuthContext/authContext';
import userService from '~/services/userService';
import ChatContext from '~/context/ChatContext/chatContext';
import EllipsisText from '~/components/Text/EllipsisText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import messageService from '~/services/messageService';

const cx = classNames.bind(styles);

function ListFriends() {
    const { user } = useContext(AuthContext);
    const { setSelectedFriendId, friends, selectedFriendId, markMessageAsSeen } = useContext(ChatContext);

    const handleSelect = async (id) => {
        setSelectedFriendId(id);

        const friendSelected = friends.find((friend) => friend.info.id === id);
        const lastMessage = friendSelected.info.lastMessage;
        if (lastMessage && lastMessage.receiverId === user.id && !lastMessage.isSeen) {
            await messageService.markMessageAsSeen(user.id, id);
            markMessageAsSeen(true);
        }
    };

    return (
        <div className={cx('wrapper')}>
            {friends?.map((friend) => {
                const lastMessage = friend.info?.lastMessage;

                const isMesssageUnSeen = lastMessage && lastMessage.receiverId === user.id && !lastMessage?.isSeen;

                return (
                    <div
                        key={friend.Id}
                        className={cx('item', {
                            active: friend.info.id === selectedFriendId,
                        })}
                        onClick={() => handleSelect(friend.info.id)}
                    >
                        <Image src={friend.info.avatarUrl} alt="" className={cx('img')} />
                        <div className={cx('info')}>
                            <EllipsisText bold={isMesssageUnSeen}>
                                {friend.info.firstName} {friend.info.lastName}
                            </EllipsisText>
                            <EllipsisText small sub={isMesssageUnSeen} bold={isMesssageUnSeen}>
                                {lastMessage?.senderId === user.id && 'Bạn: '}
                                {lastMessage?.content}
                            </EllipsisText>
                        </div>

                        {isMesssageUnSeen && <FontAwesomeIcon icon={faCircle} className={cx('seen-icon')} />}
                    </div>
                );
            })}
        </div>
    );
}

export default ListFriends;
