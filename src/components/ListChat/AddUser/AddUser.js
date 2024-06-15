import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './AddUser.module.scss';
import Image from '../../Image';
import Button from '~/components/Button';
import { Modal } from 'antd';
const cx = classNames.bind(styles);

function AddUser({ visible, onClose }) {
    const [name, setName] = useState('');

    useEffect(() => {
        if (!visible) {
            setName('');
        }
    }, [visible]);

    const handleInputChange = (e) => {
        setName(e.target.value);
    };

    return (
        <Modal width={410} open={visible} footer={null} onCancel={onClose} maskClosable={false}>
            <div className={cx('wrapper')}>
                <form>
                    <input type="text" placeholder="Name" name="Name" value={name} onChange={handleInputChange} />
                </form>
                <div className={cx('user')}>
                    <div className={cx('detail')}>
                        <Image src="" alt="" />
                        <span>Quang Hào</span>
                    </div>
                    <Button primary small>
                        Add
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

export default AddUser;
