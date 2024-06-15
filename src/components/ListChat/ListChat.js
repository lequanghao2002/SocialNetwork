import React from 'react';
import classNames from 'classnames/bind';
import styles from './ListChat.module.scss';
import UserInfo from './UserInfo';
import Search from './Search';
import ListFriends from './ListFriends';
import AddUser from './AddUser';

const cx = classNames.bind(styles);

function ListChat() {
    return (
        <div className={cx('wrapper')}>
            <UserInfo />
            <Search />
            <ListFriends />
        </div>
    );
}

export default ListChat;
