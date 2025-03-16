import classNames from 'classnames/bind';
import styles from './Icon.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const cx = classNames.bind(styles);

function Icon({ icon, leftText, rightText, onClick }) {
    return (
        <div className={cx('wrapper')} onClick={onClick}>
            {leftText && <span className={cx('left-text')}>{leftText}</span>}
            <FontAwesomeIcon icon={icon} className={cx('icon')} />
            {rightText && <span className={cx('left-right')}>{rightText}</span>}
        </div>
    );
}

export default Icon;
