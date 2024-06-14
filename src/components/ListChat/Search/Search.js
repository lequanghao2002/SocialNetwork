import React from 'react';
import classNames from 'classnames/bind';
import styles from './Search.module.scss';
import Image from '~/components/Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faPenToSquare, faPlus, faPlusSquare, faSearch, faVideo } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Search() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('search')}>
                <div className={cx('search-bar')}>
                    <FontAwesomeIcon icon={faSearch} />
                    <input type="text" placeholder="Search friends" />
                </div>
                <FontAwesomeIcon icon={faPlus} className={cx('icon-plus')} />
            </div>
        </div>
    );
}

export default Search;
