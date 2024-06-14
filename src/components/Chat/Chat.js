import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Chat.module.scss';
import Image from '../Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCamera,
    faCircleInfo,
    faFaceSmile,
    faImage,
    faMicrophone,
    faPhone,
    faVideo,
} from '@fortawesome/free-solid-svg-icons';
import Button from '../Button';
import EmojiPicker from 'emoji-picker-react';

const cx = classNames.bind(styles);

function Chat() {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');

    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    });

    const handleClickEmoji = (e) => {
        setText((prev) => prev + e.emoji);
        setOpen(false);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('top')}>
                <div className={cx('user')}>
                    <Image src="" alt="" className={cx('img')} />
                    <div className={cx('info')}>
                        <span>Quang Hào</span>
                        <p>Hello workkkkkkkkkkkkkkkkkkkkkkkkk</p>
                    </div>
                </div>
                <div className={cx('icons')}>
                    <FontAwesomeIcon icon={faPhone} />
                    <FontAwesomeIcon icon={faVideo} />
                    <FontAwesomeIcon icon={faCircleInfo} />
                </div>
            </div>

            <div className={cx('center')}>
                <div className={cx('message')}>
                    <Image src="" alt="" className={cx('img')} />
                    <div className={cx('texts')}>
                        <p>
                            Hello
                            workkksdfdsfdfdddddddddddddddddddddddddddddđsdfdsfdfdddddddddddddddddddddddddddddđsdfdsfdfdddddddddddddddddddddddddddddđsdfdsfdfdddddddddddddddddddddddddddddđsdfdsfdfdddddddddddddddddddddddddddddđsdfdsfdfdddddddddddddddddddddddddddddđsdfdsfdfdddddddddddddddddddddddddddddđsdfdsfdfdddddddddddddddddddddddddddddđsdfdsfdfdddddddddddddddddddddddddddddđkkkkkkkkkkkkkkkkkkkkkk
                            Hello
                        </p>
                        <span>1 min ago</span>
                    </div>
                </div>
                <div className={cx('message', 'own')}>
                    <div className={cx('texts')}>
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbKKq80PgBVyLpEBhwgkzg77u9jihRZINHiQ&s"
                            alt=""
                        />
                        <p>
                            Hello
                            workkksdfdsfdfdddddddddddddddddddddddddddddđsdfdsfdfdddddddddddddddddddddddddddddđsdfdsfdfdddddddddddddddddddddddddddddđsdfdsfdfdddddddddddddddddddddddddddddđsdfdsfdfdddddddddddddddddddddddddddddđsdfdsfdfdddddddddddddddddddddddddddddđsdfdsfdfdddddddddddddddddddddddddddddđsdfdsfdfdddddddddddddddddddddddddddddđsdfdsfdfdddddddddddddddddddddddddddddđkkkkkkkkkkkkkkkkkkkkkk
                        </p>
                        <span>1 min ago</span>
                    </div>
                </div>
                <div className={cx('message')}>
                    <Image src="" alt="" className={cx('img')} />
                    <div className={cx('texts')}>
                        <p>Hello </p>
                        <span>1 min ago</span>
                    </div>
                </div>

                <div ref={endRef}></div>
            </div>

            <div className={cx('bottom')}>
                <div className={cx('icons')}>
                    <FontAwesomeIcon icon={faImage} />
                    <FontAwesomeIcon icon={faCamera} />
                    <FontAwesomeIcon icon={faMicrophone} />
                </div>
                <input
                    className={cx('input-send')}
                    type="text"
                    placeholder="Type a message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <div className={cx('emoji')}>
                    <FontAwesomeIcon icon={faFaceSmile} onClick={() => setOpen((prev) => !prev)} />
                    <div className={cx('picker')}>
                        <EmojiPicker open={open} onEmojiClick={handleClickEmoji} theme="dark" />
                    </div>
                </div>
                <Button primary small>
                    Send
                </Button>
            </div>
        </div>
    );
}

export default Chat;
