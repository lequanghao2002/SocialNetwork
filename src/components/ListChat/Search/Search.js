import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Search.module.scss';
import Image from '~/components/Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEllipsis,
    faMinus,
    faPenToSquare,
    faPlus,
    faPlusSquare,
    faSearch,
    faVideo,
} from '@fortawesome/free-solid-svg-icons';
import AddUser from '../AddUser';

const cx = classNames.bind(styles);

function Search() {
    const [showAddUser, setShowAddUser] = useState(false);

    const handleShowAddUser = () => {
        setShowAddUser((prev) => !prev);
    };

    return (
        <>
            <AddUser visible={showAddUser} onClose={() => setShowAddUser(false)} />

            <div className={cx('wrapper')}>
                <div className={cx('search')}>
                    <div className={cx('search-bar')}>
                        <FontAwesomeIcon icon={faSearch} />
                        <input type="text" placeholder="Search friends" />
                    </div>

                    <FontAwesomeIcon
                        icon={showAddUser ? faMinus : faPlus}
                        className={cx('icon')}
                        onClick={handleShowAddUser}
                    />
                </div>
            </div>
        </>
    );
}

export default Search;
