import classNames from 'classnames/bind';
import styles from './AccountPreview.module.scss';
import Button from '~/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faUserPlus } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function AccountPreview() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <img
                    className={cx('avatar')}
                    src="https://scontent.fsgn5-13.fna.fbcdn.net/v/t39.30808-1/442505173_1987519968317490_8947428851547572351_n.jpg?stp=cp0_dst-jpg_p40x40&_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeFZmrHNdMiqZcMt0SibqskPzIGptUJx7pTMgam1QnHulPU4bpplWwNcWG9e8wZ48RmfDfPFaa2-g3tmnNKLryps&_nc_ohc=tFe22mxkVYEQ7kNvgGvFxtu&_nc_ht=scontent.fsgn5-13.fna&oh=00_AYAHEJm4pW8Mrn-LahfdWf2O5Vih4Ism8vxQAUKnyL5Tlw&oe=664E7B98"
                    alt=""
                />
                <div className={cx('info')}>
                    <Button text className={cx('nickname')}>
                        <strong>Lê Quang Hào</strong>
                    </Button>
                    <Button text className={cx('study-at')}>
                        Trường Đại học Yersin Đà Lạt
                    </Button>
                    <Button text className={cx('live-at')}>
                        Ninh Thuận
                    </Button>
                </div>
            </div>

            <div className={cx('body')}>
                <Button leftIcon={<FontAwesomeIcon icon={faCommentDots} />}>Message</Button>
                <Button primary leftIcon={<FontAwesomeIcon icon={faUserPlus} />}>
                    Add friend
                </Button>
            </div>
        </div>
    );
}

export default AccountPreview;
