import classNames from 'classnames/bind';
import styles from './AccountItem.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faMessage, faShare, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import Image from '../Image';
import { useEffect, useState } from 'react';
import postService from '~/services/postService';
import config from '~/config';

const cx = classNames.bind(styles);

function AccountItem({ data, onSearch, keyword }) {
    const [sharedCount, setSharedCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCountPostShared(data.id);
    }, [data.id]);

    const fetchCountPostShared = async (id) => {
        const result = await postService.countSharedPost(id);
        if (result) {
            setSharedCount(result);
        } else {
            console.error('Failed to fetch shared post count');
        }
    };
    return (
        <div
            className={cx('wrapper')}
            onClick={() => {
                navigate(config.routes.search, { state: { data: data, keyword: keyword } });
                onSearch();
            }}
        >
            <Image src={data.user.avatarUrl} />
            <div className={cx('info')}>
                <h4 className={cx('name')}>
                    <span>{`${data.user.firstName} ${data.user.lastName}`}</span>
                </h4>
                <span className={cx('content')}>{data.content}</span>
                <div className={cx('interact')}>
                    <span>
                        <FontAwesomeIcon icon={faThumbsUp} style={{ marginRight: '6px' }} />
                        {data.likes.length || 0}
                    </span>
                    <span>
                        <FontAwesomeIcon icon={faMessage} style={{ marginRight: '6px' }} />
                        {data.comments.length || 0}
                    </span>
                    <span>
                        <FontAwesomeIcon icon={faShare} style={{ marginRight: '6px' }} />
                        {sharedCount}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default AccountItem;
