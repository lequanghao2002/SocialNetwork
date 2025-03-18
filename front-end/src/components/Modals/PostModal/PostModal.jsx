import React, { useEffect, useRef } from 'react';
import { Form, Modal, Button } from 'antd';
import Avatar from '~/components/Image';
import postService from '~/services/postService';
import './PostModal.css';
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
import { useMessage } from '~/context/MessageProvider';

function PostModal() {
    const dispatch = useDispatch();
    const user = useSelector(userSelector);
    const postModal = useSelector(postModalSelector);
    const loading = useSelector(postLoadingSelector);

    const { success, error } = useMessage();
    const inputAreaRef = useRef();

    const [form] = Form.useForm();
    const content = useWatch('content', form);

    useEffect(() => {
        if (postModal.isOpen) {
            if (postModal.type === 'add' || postModal.type === 'share') {
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
                    images: postModal.data.images
                        ? JSON.parse(postModal.data.images).map((image) => ({ url: image }))
                        : [],
                    tags: postModal.data.tags ? postModal.data.tags.map((tag) => tag.name) : [],
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
            switch (postModal.type) {
                case 'add': {
                    res = await postService.add(data);
                    success('Add post successfully');
                    dispatch(addPost(res));
                    break;
                }
                case 'share': {
                    res = await postService.add({ ...data, sharedPostId: postModal.data.id });
                    dispatch(addPost({ ...res, sharedPost: postModal.data }));
                    success('Share post successfully');
                    break;
                }
                case 'update': {
                    res = await postService.update({ ...data, id: postModal.data.id });
                    success('Update post successfully');
                    dispatch(updatePost(res));
                    break;
                }
                default: {
                    console.log('Type post invalid ');
                }
            }
        } catch (err) {
            console.error('Error:', err);
            switch (postModal.type) {
                case 'add':
                    error('Add post failed');
                    break;
                case 'share':
                    error('Share post failed');
                    break;
                case 'update':
                    error('Update post failed');
                    break;
                default:
                    break;
            }
        } finally {
            dispatch(setLoading({ name: 'post', isLoading: false }));
            dispatch(closeModal('post'));
        }
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
            <h2 className="title-post">
                {postModal.type === 'add' ? 'Add' : postModal.type === 'share' ? 'Share' : 'Update'} post
            </h2>

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

                <Form.Item name="images" hidden={postModal.type === 'share'}>
                    <ImagesPickerField />
                </Form.Item>

                <Form.Item name="tags" hidden={postModal.type === 'share'}>
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
                        {postModal.type === 'add' ? 'Post' : postModal.type === 'share' ? 'Share' : 'Save'}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default PostModal;
