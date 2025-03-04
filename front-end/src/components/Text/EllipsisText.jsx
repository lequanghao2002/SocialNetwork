import classNames from 'classnames/bind';
import styles from './EllipsisText.module.scss';

const cx = classNames.bind(styles);

function EllipsisText({ children, lines = 1, sub = false, small = false, bold = false }) {
    return <div className={cx('ellipsis-text', `line-${lines}`, { sub, small, bold })}>{children}</div>;
}

export default EllipsisText;
