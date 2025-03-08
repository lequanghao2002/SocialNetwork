import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import PostCreate from '~/components/Post/PostCreate/PostCreate';
import FilterStatus from '~/components/Post/FilterStatus/FilterStatus';
import ListPost from '~/components/Post/ListPost/ListPost';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { filterSelector, pagingSelector } from '~/features/post/postSelector';
import { fetchPostsThunk } from '~/features/post/postThunk';

const cx = classNames.bind(styles);

function Home() {
    const dispatch = useDispatch();
    const filter = useSelector(filterSelector);
    const paging = useSelector(pagingSelector);

    useEffect(() => {
        dispatch(fetchPostsThunk({ filter, paging }));
    }, [filter, paging]);

    return (
        <div className={cx('wrapper')}>
            <PostCreate />

            <FilterStatus />

            <ListPost />
        </div>
    );
}

export default Home;
