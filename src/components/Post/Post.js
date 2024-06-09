import { useContext, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Post.module.scss';
import Button from '../Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBookmark,
    faEllipsisVertical,
    faMessage,
    faPenToSquare,
    faShare,
    faThumbsUp,
    faTrash,
} from '@fortawesome/free-solid-svg-icons';
import AccountPopper from '~/components/AccountPopper';
import { Image } from 'antd';
import Menu from '~/components/Popper/Menu';
import { AppContext } from '~/context/AppProvider';
import PostModal from '~/components/Modals/PostModal';
import * as postService from '~/services/postService';

const cx = classNames.bind(styles);

function Post({ data, handlePostSubmit, handleDeletePost }) {
    const { isPostModalVisible, setIsPostModalVisible, postCurrent, setPostCurrent, modePost, setModePost } =
        useContext(AppContext);

    let imageArray = [];
    if (data.images) {
        imageArray = JSON.parse(data.images);
    }

    const MENU_ITEMS = [
        {
            icon: <FontAwesomeIcon icon={faPenToSquare}></FontAwesomeIcon>,
            title: 'Update post',
        },
        {
            icon: <FontAwesomeIcon icon={faBookmark}></FontAwesomeIcon>,
            title: 'Save post',
        },
        {
            icon: <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>,
            title: 'Delete post',
        },
    ];

    // Handle logic
    const handleMenuChange = (menuItem) => {
        console.log(menuItem);

        switch (menuItem.title) {
            case 'Update post': {
                setPostCurrent(data);
                setModePost('Update');
                setIsPostModalVisible(true);
                break;
            }
            case 'Delete post': {
                //onDeletePost(data.id);
                handleDelete();
                break;
            }
            default:
        }
    };

    // const onDeletePost = async (id) => {
    //     try {
    //         const result = await postService.deletePost(id);
    //         if (result) {
    //         } else {
    //             console.error('Invalid data format:', result);
    //         }
    //     } catch (error) {
    //         console.error('Failed to fetch posts:', error);
    //     }
    // };

    const handleDelete = () => {
        handleDeletePost(data.id);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <AccountPopper data={data} />

                {/* <PostModal data={data} /> */}
                <PostModal onSubmit={handlePostSubmit} />
                <Menu items={MENU_ITEMS} onChange={handleMenuChange}>
                    <span>
                        <FontAwesomeIcon className={cx('icon-ellipsis')} icon={faEllipsisVertical} />
                    </span>
                </Menu>
            </div>

            <div className={cx('body')}>
                <p className={cx('text')}>{data.content}</p>
                <Image.PreviewGroup
                    preview={{
                        onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                    }}
                >
                    {imageArray.map((imageUrl, index) => (
                        <div className={cx('image')}>
                            <Image
                                key={index}
                                width={100}
                                height={100}
                                src={`${process.env.REACT_APP_BASE_URL2}${imageUrl}`}
                            />
                        </div>
                    ))}
                </Image.PreviewGroup>
            </div>

            <div className={cx('footer')}>
                {data.listTag &&
                    data.listTag.map((item) => (
                        <span key={item.id} className={cx('tag')}>
                            #{item.name}
                        </span>
                    ))}
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
