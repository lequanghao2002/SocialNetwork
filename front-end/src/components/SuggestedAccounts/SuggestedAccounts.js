import classNames from 'classnames/bind';
import styles from './SuggestedAccounts.module.scss';
import AccountItem from './AccountItem';
import { useContext, useEffect, useState } from 'react';
import ChatContext from '~/context/ChatContext/chatContext';
const cx = classNames.bind(styles);

function SuggestedAccounts({ label }) {
    const { friends } = useContext(ChatContext);

    return (
        <div className={cx('wrapper')}>
            <p className={cx('label')}>{label}</p>

            {friends?.map((item, index) => (
                <AccountItem key={index} data={item}></AccountItem>
            ))}
        </div>
    );
}

export default SuggestedAccounts;
