import classNames from 'classnames/bind';
import styles from './Post.module.scss';
import Button from '../Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faShare, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import AccountPopper from '~/components/AccountPopper';

const cx = classNames.bind(styles);

function Post() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <AccountPopper />
                {/* <Image
                    src="https://scontent.fdad3-5.fna.fbcdn.net/v/t39.30808-1/442505173_1987519968317490_8947428851547572351_n.jpg?stp=cp0_dst-jpg_p40x40&_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeFZmrHNdMiqZcMt0SibqskPzIGptUJx7pTMgam1QnHulPU4bpplWwNcWG9e8wZ48RmfDfPFaa2-g3tmnNKLryps&_nc_ohc=tFe22mxkVYEQ7kNvgGvFxtu&_nc_ht=scontent.fdad3-5.fna&oh=00_AYCVaW3Fw1jd_YdVMdlExkXo6DzD1LmRp3iD2PaGxaGTrA&oe=664F5C98"
                    alt=""
                />
                <div className={cx('info')}>
                    <span className={cx('name')}>Lê Quang Hào</span>
                    <span className={cx('time')}>2 hours ago</span>
                </div> */}
            </div>

            <div className={cx('body')}>
                <span className={cx('text')}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                    industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type
                    and scrambled it to make a type specimen book. It has survived not only five centuries, but also the
                    leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s
                    with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
                    publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </span>
            </div>

            <div className={cx('footer')}>
                <div className={cx('tag')}>#typescript</div>
                <div className={cx('interact')}>
                    <Button leftIcon={<FontAwesomeIcon icon={faThumbsUp} />}>204</Button>
                    <Button leftIcon={<FontAwesomeIcon icon={faMessage} />}>10</Button>
                    <Button leftIcon={<FontAwesomeIcon icon={faShare} />}>5</Button>
                </div>
            </div>
        </div>
    );
}

export default Post;
