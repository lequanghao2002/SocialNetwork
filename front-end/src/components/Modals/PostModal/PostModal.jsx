import React, { useContext, useEffect, useRef, useState, Spin } from 'react';
import { Form, Input, Modal, Button, Dropdown, Space, Select, Image, Upload } from 'antd';
import Avatar from '~/components/Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronDown,
    faEarthAsia,
    faFileImage,
    faLock,
    faSpinner,
    faUserGroup,
} from '@fortawesome/free-solid-svg-icons';

import postService from '~/services/postService';
import tagService from '~/services/tagService';
import { AppContext } from '~/context/AppProvider';
import './PostModal.css';
import * as modePostConstant from '~/constant';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector } from '~/features/auth/authSelector';
import { postLoadingSelector, postModalSelector } from '~/features/modal/modalSelector';
import { closeModal, setLoading } from '~/features/modal/modalSlice';
import TextAreaField from '~/components/Form/Fields/TextAreaField';
import ImagesPickerField from '~/components/Form/Fields/ImagePicker/ImagesPickerField2';
import TagSelectField from '~/components/Form/Fields/Tag/TagSelectField';
import PostStatusField from '~/components/Form/Fields/PostStatus/PostStatusField';
import { useWatch } from 'antd/es/form/Form';
import LoadingModal from '../LoadingModal/LoadingModal';
import { addPost, updatePost } from '~/features/post/postSlice';

function PostModal() {
    const dispatch = useDispatch();
    const user = useSelector(userSelector);
    const postModal = useSelector(postModalSelector);
    const loading = useSelector(postLoadingSelector);

    const inputAreaRef = useRef();

    const [form] = Form.useForm();
    const content = useWatch('content', form);

    useEffect(() => {
        if (postModal.isOpen) {
            if (postModal.type === 'add') {
                form.setFieldsValue({
                    content: '',
                    status: 1,
                    images: [],
                    tags: [],
                });
            } else if (postModal.type === 'update') {
                form.setFieldsValue({
                    content: postModal.data.content,
                    status: postModal.data.status,
                    images: JSON.parse(postModal.data.images).map((image) => ({ url: image })),
                    tags: postModal.data.listTag.map((tag) => tag.name),
                });
            }

            setTimeout(() => {
                inputAreaRef.current && inputAreaRef.current.focus();
            }, 0);
        }
    }, [postModal.isOpen]);

    const handleSubmit = async () => {
        dispatch(setLoading({ name: 'post', isLoading: true }));
        const formValues = form.getFieldsValue();

        const images = formValues.images.map((file) => file.url);

        var data = { ...formValues, images };

        try {
            let res = null;
            if (postModal.type === 'add') {
                res = await postService.add(data);
                dispatch(addPost(res));
            } else if (postModal.type === 'update') {
                res = await postService.update({ ...data, id: postModal.data.id });
                dispatch(updatePost(res));
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            dispatch(setLoading({ name: 'post', isLoading: false }));
            dispatch(closeModal('post'));
        }

        console.log(data);

        // const fetchApi = async () => {
        //     try {
        //         let result = null;

        //         if (modePost === modePostConstant.modeAdd) {
        //             result = await postService.addPost(formData);
        //         } else if (modePost === modePostConstant.modeUpdate) {
        //             formData.append('Id', postCurrent.id);
        //             result = await postService.updatePost(formData);
        //         } else if (modePost === modePostConstant.modeShare) {
        //             formData.append('SharedPostId', postCurrent.id);
        //             result = await postService.addPost(formData);
        //         } else {
        //             console.log('result is null');
        //         }

        //         if (result != null) {
        //             setIsPostModalVisible(false);
        //             //onSubmit(result);
        //         }
        //     } catch (error) {
        //         console.error('Error:', error);
        //     } finally {
        //         form.resetFields();
        //         //setFileList([]);
        //         setSelectedTag([]);
        //         setStatusPost([]);
        //         setIsPostModalVisible(false);
        //         //setLoading(false);
        //     }
        // };
        // fetchApi();
    };

    return (
        <Modal
            width={600}
            open={postModal.isOpen}
            onCancel={() => dispatch(closeModal('post'))}
            okText="Post"
            footer={null} // Ẩn footer để tránh xung đột
            maskClosable={false} // Disable mask closing when loading
            closable={!loading} // Disable close button when loading
        >
            {loading && <LoadingModal title="Posting" />}
            {/* Loading overlay */}
            <h2 className="title-post">{postModal.type === 'add' ? 'Add' : 'Update'} post</h2>

            <Form form={form} onFinish={handleSubmit}>
                {user && (
                    <div className="body-post">
                        <Avatar src={user.avatarUrl} />
                        <div className="info-post">
                            <span className="name">{user.firstName + ' ' + user.lastName}</span>
                            <Form.Item name="status">
                                <PostStatusField />
                            </Form.Item>
                        </div>
                    </div>
                )}

                <Form.Item name="content">
                    <TextAreaField
                        ref={inputAreaRef}
                        placeholder="Share your programming knowledge here..."
                        className="customTextArea"
                    />
                </Form.Item>

                <Form.Item name="images">
                    <ImagesPickerField />
                </Form.Item>

                <Form.Item name="tags">
                    <TagSelectField mode="tags" placeholder="Select tags" />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit" // Form tự động gọi `onFinish`
                        className={content?.trim() ? 'customFooterButton' : 'customFooterButtonDisable'}
                        disabled={!content?.trim() || loading}
                        loading={loading}
                    >
                        Post
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default PostModal;
