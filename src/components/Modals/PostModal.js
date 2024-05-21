import React, { useContext } from 'react';
import { Form, Input, Modal } from 'antd';
import { AppContext } from '~/Context/AppProvider';
import './PostModal.css';

function PostModel() {
    const { isPostModalVisible, setIsPostModalVisible } = useContext(AppContext);
    const [form] = Form.useForm();

    const handleOk = () => {
        console.log(form.getFieldsValue());
        setIsPostModalVisible(false);
    };

    const handleCancel = () => {
        setIsPostModalVisible(false);
    };

    return (
        <div>
            <Modal
                title="Add post"
                open={isPostModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                className="customModal"
            >
                <Form form={form}>
                    <Form.Item name="content">
                        <Input.TextArea placeholder="Content" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default PostModel;
