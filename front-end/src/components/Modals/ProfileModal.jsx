import { Form, Input, Modal, message } from 'antd';
import Image from '../Image';
import './ProfileModal.scss';
import Button from '../Button';
import { useEffect } from 'react';
import userServies from '~/services/userService';

function ProfileModal({ visible, setVisible, onClose, userInfo, onUpdate }) {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const success = (message) => {
        messageApi.open({
            type: 'success',
            content: message,
            style: {},
        });
    };

    const error = (message) => {
        messageApi.open({
            type: 'error',
            content: message,
            style: {},
        });
    };

    useEffect(() => {
        form.setFieldsValue(userInfo?.userProfile);
    }, [visible]);

    const handleEditUserProfile = async () => {
        const data = { ...form.getFieldsValue(), UserId: userInfo.id };
        await userServies
            .updateUserProfile(data)
            .then((res) => {
                onUpdate();
                success(res);
            })
            .catch((res) => {
                console.log(res);
            })
            .finally(() => {
                setVisible(false);
                form.resetFields();
            });
    };

    return (
        <>
            {contextHolder}
            <Modal open={visible} footer={null} onCancel={onClose} maskClosable={false}>
                <div className="wrapper">
                    <Form form={form}>
                        <Form.Item name="introduce" label="Introduce">
                            <Input />
                        </Form.Item>

                        <Form.Item name="liveAt" label="Live At">
                            <Input />
                        </Form.Item>

                        <Form.Item name="studyAt" label="Study At">
                            <Input />
                        </Form.Item>

                        <Form.Item name="workingAt" label="Working At">
                            <Input />
                        </Form.Item>

                        <Form.Item name="github" label="Github">
                            <Input />
                        </Form.Item>

                        <Form.Item name="facebook" label="Facebook">
                            <Input />
                        </Form.Item>

                        <Form.Item name="linkedIn" label="LinkedIn">
                            <Input />
                        </Form.Item>
                    </Form>

                    <Button primary small className="btn-edit" onClick={handleEditUserProfile}>
                        Edit
                    </Button>
                </div>
            </Modal>
        </>
    );
}

export default ProfileModal;
