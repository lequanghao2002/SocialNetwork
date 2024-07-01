import { useLocation, useParams } from 'react-router-dom';
import styles from './Search.module.scss';
import classNames from 'classnames/bind';
import Post from '~/components/Post';
import { Empty } from 'antd';

const cx = classNames.bind(styles);

function Search() {
    const location = useLocation();

    let data = location.state?.data;
    const keyword = location.state?.keyword;

    // Kiểm tra và xử lý data nếu nó là một object
    if (!Array.isArray(data)) {
        data = [data];
    }

    console.log('data', { data });
    return (
        <>
            <h1>
                Search results of: <span style={{ color: 'red' }}>{keyword}</span>
            </h1>
            <div className={cx('wrapper')}>
                {data.length > 0 ? (
                    data?.map((item) => <Post data={item}></Post>)
                ) : (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={<p style={{ color: '#fff' }}>No data</p>}
                    />
                )}
            </div>
        </>
    );
}

export default Search;
