import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import Button from '~/components/Button';
import {
    faClock,
    faFaceSmile,
    faFileCode,
    faFileImage,
    faFileLines,
    faFire,
    faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from '~/components/Image';
import Icon from '~/components/Icon';
import Post from '~/components/Post';
import { useContext } from 'react';
import { AppContext } from '~/context/AppProvider';
import PostModel from '~/components/Modals/PostModal';

const cx = classNames.bind(styles);

function Home() {
    const { isPostModalVisible, setIsPostModalVisible } = useContext(AppContext);

    const handleShowPostModel = () => {
        setIsPostModalVisible(true);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('post-new')}>
                <div className={cx('header')}>
                    <Image
                        src="https://scontent.fdad3-5.fna.fbcdn.net/v/t39.30808-1/442505173_1987519968317490_8947428851547572351_n.jpg?stp=dst-jpg_p200x200&_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeFZmrHNdMiqZcMt0SibqskPzIGptUJx7pTMgam1QnHulPU4bpplWwNcWG9e8wZ48RmfDfPFaa2-g3tmnNKLryps&_nc_ohc=tFe22mxkVYEQ7kNvgGvFxtu&_nc_ht=scontent.fdad3-5.fna&oh=00_AYA2TVm31yGxfRfyW9nTG88i-8dvLwloYMPc0GprmMLYiA&oe=664F5C98"
                        alt=""
                    />
                    <div className={cx('input')} onClick={handleShowPostModel}>
                        <span className={cx('text')}>New post!</span>
                        <span className={cx('icon')}>
                            <FontAwesomeIcon icon={faFaceSmile} />
                        </span>
                    </div>
                </div>
                <div className={cx('option')}>
                    <Icon icon={faFileCode} rightText={'Code'} />
                    <Icon icon={faFileImage} rightText={'Image'} />
                    <Icon icon={faFileLines} rightText={'File'} />
                </div>
            </div>

            <div className={cx('post-nav')}>
                <Button small leftIcon={<FontAwesomeIcon icon={faClock} />} className={cx('')}>
                    Recent
                </Button>
                <Button small leftIcon={<FontAwesomeIcon icon={faUsers} />} className={cx('')}>
                    Friends
                </Button>
                <Button small leftIcon={<FontAwesomeIcon icon={faFire} />} className={cx('')}>
                    Popular
                </Button>
            </div>

            <div className={cx('post-body')}>
                <Post />
                <Post />
                <Post />
                <Post />
                <Post />
                <Post />
                <Post />
            </div>
        </div>
    );
}

export default Home;
