import classNames from 'classnames/bind';
import styles from './SuggestedAccounts.module.scss';
import AccountItem from './AccountItem';
import * as userServices from '~/services/userService';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '~/context';

const cx = classNames.bind(styles);

function SuggestedAccounts({ label }) {
    const [listFriendShip, setListFriendShip] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchListFriendship(user.Id);
    }, []);

    const fetchListFriendship = async (Id) => {
        try {
            const result = await userServices.getListFriendship(Id);
            setListFriendShip(result);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <p className={cx('label')}>{label}</p>

            {listFriendShip?.map((item, index) => (
                <AccountItem key={index} data={item}></AccountItem>
            ))}
        </div>
    );
}

export default SuggestedAccounts;
