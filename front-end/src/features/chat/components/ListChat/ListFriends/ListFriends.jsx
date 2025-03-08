import React, { useContext } from 'react';
import classNames from 'classnames/bind';
import styles from './ListFriends.module.scss';
import Image from '~/components/Image';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import EllipsisText from '~/components/Text/EllipsisText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import messageService from '~/services/messageService';
import { friendsSelector, selectedFriendIdSelector } from '~/features/chat/chatSelector';
import { useDispatch, useSelector } from 'react-redux';
import { markMessageAsSeen, setSelectedFriendId } from '~/features/chat/chatSlice';
import { userSelector } from '~/features/auth/authSelector';

const cx = classNames.bind(styles);

function ListFriends() {
    const user = useSelector(userSelector);
    const dispatch = useDispatch();
    const friends = useSelector(friendsSelector);
    const selectedFriendId = useSelector(selectedFriendIdSelector);

    const handleSelect = async (id) => {
        dispatch(setSelectedFriendId(id));

        const friendSelected = friends.find((friend) => friend.info.id === id);
        const lastMessage = friendSelected.info.lastMessage;
        if (lastMessage && lastMessage.receiverId === user.id && !lastMessage.isSeen) {
            await messageService.markMessageAsSeen(user.id, id);
            dispatch(markMessageAsSeen(true));
        }
    };

    return (
        <div className={cx('wrapper')}>
            {friends?.map((friend) => {
                const lastMessage = friend.info?.lastMessage;

                const isMesssageUnSeen = lastMessage && lastMessage.receiverId === user.id && !lastMessage?.isSeen;

                return (
                    <div
                        key={friend.info.id}
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
