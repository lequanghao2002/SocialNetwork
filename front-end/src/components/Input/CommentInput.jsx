import { useState } from 'react';
import styles from './CommentInput.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faFaceSmile, faImage, faMicrophone } from '@fortawesome/free-solid-svg-icons';
import EmojiPicker from 'emoji-picker-react';
import Button from '../Button';

const cx = classNames.bind(styles);

function CommentInput({
    initialText = '',
    onSubmit,
    onHandleImg,
    onCancel,
    placeholder = 'Type a message...',
    submitText = 'Send',
}) {
    const [text, setText] = useState(initialText);
    const [open, setOpen] = useState(false);

    const handleClickEmoji = (e) => {
        setText((prev) => prev + e.emoji);
        setOpen(false);
    };

    return (
        <div className={cx('input-container')}>
            <div className={cx('icons')}>
                <label htmlFor="file">
                    <FontAwesomeIcon icon={faImage} />
                </label>
                <input
                    className={cx('input-text')}
                    type="file"
                    accept="image/*"
                    id="file"
                    style={{ display: 'none' }}
                    onChange={onHandleImg}
                />
                <FontAwesomeIcon icon={faCamera} onClick={() => alert('Coming soon')} />
                <FontAwesomeIcon icon={faMicrophone} onClick={() => alert('Coming soon')} />
            </div>
            <input
                className={cx('input')}
                type="text"
                placeholder={placeholder}
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <div className={cx('emoji')}>
                <FontAwesomeIcon icon={faFaceSmile} onClick={() => setOpen((prev) => !prev)} />
                <div className={cx('picker')}>
                    <EmojiPicker open={open} onEmojiClick={handleClickEmoji} theme="dark" />
                </div>
            </div>
            <Button
                primary
                small
                onClick={() => {
                    onSubmit(text);
                    setText('');
                }}
            >
                {submitText}
            </Button>
            <Button small onClick={onCancel}>
                Cancel
            </Button>
        </div>
    );
}

export default CommentInput;
