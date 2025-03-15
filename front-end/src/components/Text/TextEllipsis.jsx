import classNames from 'classnames/bind';
import styles from './TextEllipsis.module.scss';

const cx = classNames.bind(styles);

function TextEllipsis({ children, lines = 1, sub = false, small = false, bold = false }) {
    return <div className={cx('ellipsis-text', `line-${lines}`, { sub, small, bold })}>{children}</div>;
}

export default TextEllipsis;
