import React, { useContext } from 'react';
import { Form, Input, Modal, Button } from 'antd';
import { AppContext } from '~/context/AppProvider';
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
                open={isPostModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Post"
                footer={[
                    <Button key="submit" type="primary" onClick={handleOk} className="customFooterButton">
                        Post
                    </Button>,
                ]}
                cancelButtonProps={{ style: { display: 'none' } }}
            >
                <h2 className="title">Create post</h2>
                <Form form={form}>
                    <Form.Item name="content">
                        <Input.TextArea className="customTextArea" placeholder="Content..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default PostModel;
