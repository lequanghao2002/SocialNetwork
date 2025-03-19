import { Button, Form, Modal } from 'antd';
import { useEffect } from 'react';
import { useMessage } from '~/context/MessageProvider';
import { useDispatch, useSelector } from 'react-redux';
import { profileDetailLoadingSelector, profileDetailModalSelector } from '~/features/modal/modalSelector';
import { closeModal, setLoading } from '~/features/modal/modalSlice';
import LoadingModal from '../LoadingModal/LoadingModal';
import classNames from 'classnames/bind';
import styles from './ProfileDetailModal.module.scss';
import TextField from '~/components/Form/Fields/Input/TextField';
import { updateProfileDetailThunk } from '~/features/user/userThunk';

const cx = classNames.bind(styles);

function ProfileDetailModal() {
    const dispatch = useDispatch();
    const profileDetailModal = useSelector(profileDetailModalSelector);
    const loading = useSelector(profileDetailLoadingSelector);
    console.log(profileDetailModal);
    const { success, error } = useMessage();

    const [form] = Form.useForm();

    useEffect(() => {
        if (!profileDetailModal.isOpen) return;

        form.setFieldsValue(profileDetailModal.data);
    }, [profileDetailModal.isOpen]);

    const handleFinish = async () => {
        dispatch(setLoading({ name: 'profileDetail', isLoading: true }));

        const data = form.getFieldsValue();

        try {
            await dispatch(updateProfileDetailThunk(data)).unwrap();
            success('Edit profile detail successfully');
        } catch (err) {
            error('Edit profile detail failed');
        } finally {
            dispatch(setLoading({ name: 'profileDetail', isLoading: false }));
            dispatch(closeModal('profileDetail'));
        }
    };

    return (
        <Modal
            open={profileDetailModal.isOpen}
            footer={null}
            onCancel={() => dispatch(closeModal('profileDetail'))}
            maskClosable={false}
            closable={!loading}
        >
            {loading && <LoadingModal />}
            <h2 className="title-post">Edit detail</h2>

            <div className={cx('wrapper')}>
                <Form form={form} onFinish={handleFinish} labelCol={{ span: 5 }} labelAlign="left">
                    <Form.Item name="introduce" label="Introduce">
                        <TextField />
                    </Form.Item>

                    <Form.Item name="liveAt" label="Live At">
                        <TextField />
                    </Form.Item>

                    <Form.Item name="studyAt" label="Study At">
                        <TextField />
                    </Form.Item>

                    <Form.Item name="workingAt" label="Working At">
                        <TextField />
                    </Form.Item>

                    <Form.Item name="github" label="Github">
                        <TextField />
                    </Form.Item>

                    <Form.Item name="facebook" label="Facebook">
                        <TextField />
                    </Form.Item>

                    <Form.Item name="linkedIn" label="LinkedIn">
                        <TextField />
                    </Form.Item>

                    <Form.Item>
                        <Button htmlType="submit" type="primary" block>
                            Edit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
}

export default ProfileDetailModal;
