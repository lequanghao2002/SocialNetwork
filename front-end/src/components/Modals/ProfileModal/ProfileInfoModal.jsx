import classNames from 'classnames/bind';
import styles from './ProfileInfoModal.module.scss';
import { Form, Modal, Flex, Button } from 'antd';
import { useEffect } from 'react';
import { useMessage } from '~/context/MessageProvider';
import { useDispatch, useSelector } from 'react-redux';
import { profileInfoLoadingSelector, profileInfoModalSelector } from '~/features/modal/modalSelector';
import LoadingModal from '../LoadingModal/LoadingModal';
import { closeModal, setLoading } from '~/features/modal/modalSlice';
import ImagePickerField from '~/components/Form/Fields/ImagePicker/ImagePickerField';
import TextField from '~/components/Form/Fields/Input/TextField';
import { updateProfileInfoThunk } from '~/features/user/userThunk';

const cx = classNames.bind(styles);

function ProfileInfoModal() {
    const dispatch = useDispatch();
    const profileInfoModal = useSelector(profileInfoModalSelector);
    const loading = useSelector(profileInfoLoadingSelector);

    const [form] = Form.useForm();
    const { success, error } = useMessage();

    useEffect(() => {
        if (!profileInfoModal.isOpen) return;

        form.setFieldsValue({
            ...profileInfoModal.data,
            avatarUrl: profileInfoModal.data.avatarUrl ? [{ url: profileInfoModal.data.avatarUrl }] : [],
            coverPhotoUrl: profileInfoModal.data.userProfile.coverPhotoUrl
                ? [{ url: profileInfoModal.data.userProfile.coverPhotoUrl }]
                : [],
        });
    }, [profileInfoModal.isOpen]);

    const handleFinish = async () => {
        dispatch(setLoading({ name: 'profileInfo', isLoading: true }));
        const formValues = form.getFieldsValue();

        const avatarUrl = formValues.avatarUrl.length > 0 ? formValues.avatarUrl[0].url : null;
        const coverPhotoUrl = formValues.coverPhotoUrl.length > 0 ? formValues.coverPhotoUrl[0].url : null;

        var data = { ...formValues, avatarUrl, coverPhotoUrl };

        try {
            await dispatch(updateProfileInfoThunk(data)).unwrap();
            success('Edit info successfully');
        } catch (err) {
            console.error('Error:', err);
            error('Edit info failed');
        } finally {
            dispatch(setLoading({ name: 'profileInfo', isLoading: false }));
            dispatch(closeModal('profileInfo'));
        }
    };

    return (
        <Modal
            open={profileInfoModal.isOpen}
            footer={null}
            onCancel={() => dispatch(closeModal('profileInfo'))}
            maskClosable={false}
            closable={!loading}
        >
            {loading && <LoadingModal />}

            <h2 className="title-post">Edit Info</h2>

            <div className={cx('wrapper')}>
                <Form form={form} onFinish={handleFinish}>
                    <Flex justify="center">
                        <Form.Item name="avatarUrl">
                            <ImagePickerField folder="users" listType="picture-circle" placeholder="Avatar" />
                        </Form.Item>
                    </Flex>
                    <div className={cx('customCoverPhoto')}>
                        <Form.Item name="coverPhotoUrl">
                            <ImagePickerField folder="users" placeholder="Cover Photo" />
                        </Form.Item>
                    </div>

                    <Form.Item name="firstName" label="First Name">
                        <TextField />
                    </Form.Item>

                    <Form.Item name="lastName" label="Last Name">
                        <TextField />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            block
                            type="primary"
                            htmlType="submit" // Form tự động gọi `onFinish`
                        >
                            Edit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
}

export default ProfileInfoModal;
