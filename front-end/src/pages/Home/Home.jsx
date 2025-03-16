import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import PostCreate from '~/components/Post/PostCreate/PostCreate';
import FilterStatus from '~/components/Post/FilterStatus/FilterStatus';
import ListPost from '~/components/Post/ListPost/ListPost';

const cx = classNames.bind(styles);

function Home() {
    return (
        <div className={cx('wrapper')}>
            <PostCreate />

            <FilterStatus />

            <ListPost />
        </div>
    );
}

export default Home;
