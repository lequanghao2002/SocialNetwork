import React from 'react';
import classNames from 'classnames/bind';
import styles from './ListFriends.module.scss';
import Image from '~/components/Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faPenToSquare, faPlus, faPlusSquare, faSearch, faVideo } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function ListFriends() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('item')}>
                <Image src="" alt="" className={cx('img')} />
                <div className={cx('info')}>
                    <span>Quang Hào</span>
                    <p>Hello</p>
                </div>
            </div>
            <div className={cx('item')}>
                <Image src="" alt="" className={cx('img')} />
                <div className={cx('info')}>
                    <span>Quang Hào</span>
                    <p>Hello</p>
                </div>
            </div>
            <div className={cx('item')}>
                <Image src="" alt="" className={cx('img')} />
                <div className={cx('info')}>
                    <span>Quang Hào</span>
                    <p>Hello</p>
                </div>
            </div>
            <div className={cx('item')}>
                <Image src="" alt="" className={cx('img')} />
                <div className={cx('info')}>
                    <span>Quang Hào</span>
                    <p>Hello</p>
                </div>
            </div>
            <div className={cx('item')}>
                <Image src="" alt="" className={cx('img')} />
                <div className={cx('info')}>
                    <span>Quang Hào</span>
                    <p>Hello</p>
                </div>
            </div>
        </div>
    );
}

export default ListFriends;
