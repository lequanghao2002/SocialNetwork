import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import Image from '~/components/Image';
import Button from '~/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCommentDots,
    faHouse,
    faSchool,
    faUserCheck,
    faUserPlus,
    faUserXmark,
} from '@fortawesome/free-solid-svg-icons';
import { Col, Row } from 'antd';
import { faLinkedin, faSquareFacebook, faSquareGithub } from '@fortawesome/free-brands-svg-icons';
import Home from '../Home';
import FriendStatusButton from '~/components/FriendStatusButton';

const cx = classNames.bind(styles);

const user = false;

function Profile() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('cover-image')}>
                {user && (
                    <img
                        className={cx('image')}
                        src="https://tse3.mm.bing.net/th?id=OIP.04_oUS7tY9xjVlTvczaM1QHaCv&pid=Api&P=0&h=220"
                        alt="Quang Hào"
                    />
                )}
            </div>

            <div className={cx('profile')}>
                <div className={cx('header')}>
                    <Image
                        className={cx('avatar')}
                        src="https://scontent.fdad3-4.fna.fbcdn.net/v/t39.30808-1/445034912_1995676177501869_2170167682357891660_n.jpg?stp=c23.23.180.180a_dst-jpg&_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeEPcFn2RAmL5idJSRDClVc6Dm84Su93AmgObzhK73cCaALCFsXX3aRURcIAHtuMwH4dYDEac-OzkGpvfUA8W9XJ&_nc_ohc=Pm_uHUQ4mWQQ7kNvgHYlY9-&_nc_ht=scontent.fdad3-4.fna&oh=00_AYCvpKcJV_1f0trNjQdCt7Dw7lEmlNoqqT4GsHjXdMre6g&oe=66707094"
                    />
                    <div className={cx('info')}>
                        <span className={cx('full-name')}>Quang Hào</span>
                        <span className={cx('num-friends')}>106 friends</span>
                    </div>

                    <div className={cx('action-btn')}>
                        <FriendStatusButton />
                    </div>
                </div>

                <div className={cx('body')}>
                    <Row>
                        <Col span={10}>
                            <div className={cx('intro')}>
                                <div className={cx('your-self')}>
                                    <h2>Intro</h2>
                                    <p className={cx('introduce')}>good game well played</p>
                                    <Button small>Edit bio</Button>

                                    <span>
                                        <FontAwesomeIcon icon={faHouse} className={cx('icon-intro')} />
                                        Live at:
                                        <Button text className={cx('live-at')}>
                                            Ninh Thuận
                                        </Button>
                                    </span>
                                    <span>
                                        <FontAwesomeIcon icon={faSchool} className={cx('icon-intro')} />
                                        Study at:
                                        <Button text className={cx('study-at')}>
                                            Yersin University
                                        </Button>
                                    </span>
                                    <span>
                                        <FontAwesomeIcon icon={faSquareGithub} className={cx('icon-intro')} />
                                        Github:
                                        <Button text className={cx('study-at')}>
                                            http:github.....com
                                        </Button>
                                    </span>
                                    <span>
                                        <FontAwesomeIcon icon={faLinkedin} className={cx('icon-intro')} />
                                        Linked:
                                        <Button text className={cx('study-at')}>
                                            http:Linked.....com
                                        </Button>
                                    </span>

                                    <span>
                                        <FontAwesomeIcon icon={faSquareFacebook} className={cx('icon-intro')} />
                                        Facebook:
                                        <Button text className={cx('study-at')}>
                                            http:facebook.....com
                                        </Button>
                                    </span>
                                    <Button small>Edit details</Button>
                                </div>

                                <div className={cx('friends')}>
                                    <h2>Friends</h2>
                                    <p className={cx('')}>106 friends</p>

                                    <div className={cx('list-friends')}>
                                        <div className={cx('item-friends')}>
                                            <img
                                                className={cx('img-friend')}
                                                src="https://scontent.fdad3-4.fna.fbcdn.net/v/t39.30808-1/445034912_1995676177501869_2170167682357891660_n.jpg?stp=c23.23.180.180a_dst-jpg&_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeEPcFn2RAmL5idJSRDClVc6Dm84Su93AmgObzhK73cCaALCFsXX3aRURcIAHtuMwH4dYDEac-OzkGpvfUA8W9XJ&_nc_ohc=Pm_uHUQ4mWQQ7kNvgHYlY9-&_nc_ht=scontent.fdad3-4.fna&oh=00_AYCvpKcJV_1f0trNjQdCt7Dw7lEmlNoqqT4GsHjXdMre6g&oe=66707094"
                                            />
                                            <span>Lê Quang Hào</span>
                                        </div>
                                        <div className={cx('item-friends')}>
                                            <img
                                                className={cx('img-friend')}
                                                src="https://scontent.fdad3-4.fna.fbcdn.net/v/t39.30808-1/445034912_1995676177501869_2170167682357891660_n.jpg?stp=c23.23.180.180a_dst-jpg&_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeEPcFn2RAmL5idJSRDClVc6Dm84Su93AmgObzhK73cCaALCFsXX3aRURcIAHtuMwH4dYDEac-OzkGpvfUA8W9XJ&_nc_ohc=Pm_uHUQ4mWQQ7kNvgHYlY9-&_nc_ht=scontent.fdad3-4.fna&oh=00_AYCvpKcJV_1f0trNjQdCt7Dw7lEmlNoqqT4GsHjXdMre6g&oe=66707094"
                                            />
                                            <span>Lê Quang Hào</span>
                                        </div>
                                        <div className={cx('item-friends')}>
                                            <img
                                                className={cx('img-friend')}
                                                src="https://scontent.fdad3-4.fna.fbcdn.net/v/t39.30808-1/445034912_1995676177501869_2170167682357891660_n.jpg?stp=c23.23.180.180a_dst-jpg&_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeEPcFn2RAmL5idJSRDClVc6Dm84Su93AmgObzhK73cCaALCFsXX3aRURcIAHtuMwH4dYDEac-OzkGpvfUA8W9XJ&_nc_ohc=Pm_uHUQ4mWQQ7kNvgHYlY9-&_nc_ht=scontent.fdad3-4.fna&oh=00_AYCvpKcJV_1f0trNjQdCt7Dw7lEmlNoqqT4GsHjXdMre6g&oe=66707094"
                                            />
                                            <span>Lê Quang Hào</span>
                                        </div>

                                        <div className={cx('item-friends')}>
                                            <img
                                                className={cx('img-friend')}
                                                src="https://scontent.fdad3-4.fna.fbcdn.net/v/t39.30808-1/445034912_1995676177501869_2170167682357891660_n.jpg?stp=c23.23.180.180a_dst-jpg&_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeEPcFn2RAmL5idJSRDClVc6Dm84Su93AmgObzhK73cCaALCFsXX3aRURcIAHtuMwH4dYDEac-OzkGpvfUA8W9XJ&_nc_ohc=Pm_uHUQ4mWQQ7kNvgHYlY9-&_nc_ht=scontent.fdad3-4.fna&oh=00_AYCvpKcJV_1f0trNjQdCt7Dw7lEmlNoqqT4GsHjXdMre6g&oe=66707094"
                                            />
                                            <span>Lê Quang Hào</span>
                                        </div>
                                        <div className={cx('item-friends')}>
                                            <img
                                                className={cx('img-friend')}
                                                src="https://scontent.fdad3-4.fna.fbcdn.net/v/t39.30808-1/445034912_1995676177501869_2170167682357891660_n.jpg?stp=c23.23.180.180a_dst-jpg&_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeEPcFn2RAmL5idJSRDClVc6Dm84Su93AmgObzhK73cCaALCFsXX3aRURcIAHtuMwH4dYDEac-OzkGpvfUA8W9XJ&_nc_ohc=Pm_uHUQ4mWQQ7kNvgHYlY9-&_nc_ht=scontent.fdad3-4.fna&oh=00_AYCvpKcJV_1f0trNjQdCt7Dw7lEmlNoqqT4GsHjXdMre6g&oe=66707094"
                                            />
                                            <span>Lê Quang Hào</span>
                                        </div>

                                        <div className={cx('item-friends')}>
                                            <img
                                                className={cx('img-friend')}
                                                src="https://scontent.fdad3-4.fna.fbcdn.net/v/t39.30808-1/445034912_1995676177501869_2170167682357891660_n.jpg?stp=c23.23.180.180a_dst-jpg&_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeEPcFn2RAmL5idJSRDClVc6Dm84Su93AmgObzhK73cCaALCFsXX3aRURcIAHtuMwH4dYDEac-OzkGpvfUA8W9XJ&_nc_ohc=Pm_uHUQ4mWQQ7kNvgHYlY9-&_nc_ht=scontent.fdad3-4.fna&oh=00_AYCvpKcJV_1f0trNjQdCt7Dw7lEmlNoqqT4GsHjXdMre6g&oe=66707094"
                                            />
                                            <span>Lê Quang Hào</span>
                                        </div>
                                        <div className={cx('item-friends')}>
                                            <img
                                                className={cx('img-friend')}
                                                src="https://scontent.fdad3-4.fna.fbcdn.net/v/t39.30808-1/445034912_1995676177501869_2170167682357891660_n.jpg?stp=c23.23.180.180a_dst-jpg&_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeEPcFn2RAmL5idJSRDClVc6Dm84Su93AmgObzhK73cCaALCFsXX3aRURcIAHtuMwH4dYDEac-OzkGpvfUA8W9XJ&_nc_ohc=Pm_uHUQ4mWQQ7kNvgHYlY9-&_nc_ht=scontent.fdad3-4.fna&oh=00_AYCvpKcJV_1f0trNjQdCt7Dw7lEmlNoqqT4GsHjXdMre6g&oe=66707094"
                                            />
                                            <span>Lê Quang Hào</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col span={14}>
                            <div className={cx('post')}>
                                <Home profile={true} />
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
}

export default Profile;
