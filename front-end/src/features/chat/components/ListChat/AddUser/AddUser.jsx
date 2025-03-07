import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './AddUser.module.scss';
import Button from '~/components/Button';
import { Empty, Modal } from 'antd';
import Image from '~/components/Image';
import { userSelector } from '~/features/auth/authSelector';
import { useSelector } from 'react-redux';
const cx = classNames.bind(styles);

function AddUser({ visible, onClose }) {
    const user = useSelector(userSelector);
    const [friend, setFriends] = useState(null);
    const [name, setName] = useState('');

    useEffect(() => {
        if (!visible) {
            setName('');
        }
    }, [visible]);

    const handleInputChange = (e) => {
        setName(e.target.value);
    };

    const handleSearch = async (e) => {
        // e.preventDefault();
        // const formData = new FormData(e.target);
        // const username = formData.get('username');
        // try {
        //     const userRef = collection(db, 'users');
        //     const q = query(userRef, where('username', '==', username));
        //     const querySnapShot = await getDocs(q);
        //     if (!querySnapShot.empty) {
        //         setFriends(querySnapShot.docs[0].data());
        //     } else {
        //         setFriends(null);
        //     }
        // } catch (err) {
        //     console.log(err);
        // }
    };

    const handleAdd = async () => {
        // try {
        //     const chatRef = collection(db, 'chats');
        //     const userChatsRef = collection(db, 'userchats');
        //     const newChatRef = doc(chatRef);
        //     await setDoc(newChatRef, {
        //         createdAt: serverTimestamp(),
        //         message: [],
        //     });
        //     await updateDoc(doc(userChatsRef, friend.id), {
        //         chats: arrayUnion({
        //             chatId: newChatRef.id,
        //             lastMessage: '',
        //             receiverId: user.Uid,
        //             updatedAt: Date.now(),
        //         }),
        //     });
        //     await updateDoc(doc(userChatsRef, user.Uid), {
        //         chats: arrayUnion({
        //             chatId: newChatRef.id,
        //             lastMessage: '',
        //             receiverId: friend.id,
        //             updatedAt: Date.now(),
        //         }),
        //     });
        // } catch (err) {
        //     console.log(err);
        // }
    };

    return (
        <Modal width={410} open={visible} footer={null} onCancel={onClose} maskClosable={false}>
            <div className={cx('wrapper')}>
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        value={name}
                        onChange={handleInputChange}
                    />
                    <Button small>Search</Button>
                </form>
                {friend ? (
                    <div className={cx('user')}>
                        <div className={cx('detail')}>
                            <Image src={friend.avatar} alt="" />
                            <span>{friend.username}</span>
                        </div>
                        <Button primary small onClick={handleAdd}>
                            Add
                        </Button>
                    </div>
                ) : (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={<p style={{ color: '#fff' }}>No user</p>}
                    />
                )}
            </div>
        </Modal>
    );
}

export default AddUser;
