import { faClock, faFire, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '~/components/Button';
import classNames from 'classnames/bind';
import styles from './FilterStatus.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { filterSelector } from '~/features/post/postSelector';
import { setStatus } from '~/features/post/postSlice';

const cx = classNames.bind(styles);

function FilterStatus() {
    const dispatch = useDispatch();
    const filter = useSelector(filterSelector);

    return (
        <div className={cx('post-nav')}>
            <Button
                small
                leftIcon={<FontAwesomeIcon icon={faClock} />}
                className={cx('', {
                    active: filter.status === 'Recent',
                })}
                onClick={() => dispatch(setStatus('Recent'))}
            >
                Recent
            </Button>
            <Button
                small
                leftIcon={<FontAwesomeIcon icon={faUsers} />}
                className={cx('', {
                    active: filter.status === 'Friends',
                })}
                onClick={() => dispatch(setStatus('Friends'))}
            >
                Friends
            </Button>
            <Button
                small
                leftIcon={<FontAwesomeIcon icon={faFire} />}
                className={cx('', {
                    active: filter.status === 'Popular',
                })}
                onClick={() => dispatch(setStatus('Popular'))}
            >
                Popular
            </Button>
        </div>
    );
}

export default FilterStatus;
