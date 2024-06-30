import { Form, Input, Modal, Upload, Image, message } from 'antd';
import './ProfileModal.scss';
import Button from '../Button';
import { useEffect, useState } from 'react';
import * as userService from '~/services/userService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImage } from '@fortawesome/free-solid-svg-icons';

function InfoModal({ visible, setVisible, onClose, userInfo, onUpdate }) {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [fileAvatar, setFileAvatar] = useState([]);
    const [fileCoverPhoto, setFileCoverPhoto] = useState([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

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
        const userFormat = {
            Id: userInfo?.id,
            firstName: userInfo?.firstName,
            lastName: userInfo?.lastName,
            avatarUrl: userInfo?.avatarUrl,
            coverPhotoUrl: userInfo?.userProfile?.coverPhotoUrl,
        };
        form.setFieldsValue(userFormat);
        if (userInfo?.avatarUrl) {
            const avatar = {
                name: userInfo?.avatarUrl.split('/').pop(),
                url: `${process.env.REACT_APP_BASE_URL2}${userInfo?.avatarUrl}`,
            };
            setFileAvatar([avatar]);
        } else {
            setFileAvatar([]);
        }

        if (userInfo?.userProfile?.coverPhotoUrl) {
            const photo = {
                name: userInfo?.userProfile?.coverPhotoUrl.split('/').pop(),
                url: `${process.env.REACT_APP_BASE_URL2}${userInfo?.userProfile?.coverPhotoUrl}`,
            };
            setFileCoverPhoto([photo]);
        } else {
            setFileCoverPhoto([]);
        }
    }, [visible]);

    const handleEditUser = async () => {
        var data = { ...form.getFieldsValue(), id: userInfo?.id, AvatarUrl: fileAvatar, CoverPhotoUrl: fileCoverPhoto };
        console.log({ data });
        // Tạo đối tượng FormData
        const formData = new FormData();

        // Thêm các trường dữ liệu vào formData
        formData.append('Id', data.id);
        formData.append('FirstName', data.firstName);
        formData.append('LastName', data.lastName);

        if (data.AvatarUrl && data.AvatarUrl.length > 0) {
            data.AvatarUrl.forEach((fileObj, index) => {
                if (fileObj.originFileObj instanceof File) {
                    console.log(fileObj);
                    // Nếu fileObj.originFileObj là một đối tượng File, thêm nó vào formData
                    formData.append('AvatarUrl', fileObj.originFileObj);
                } else {
                    console.log(fileObj);
                    // Nếu không phải, tạo một đối tượng File từ fileObj và thêm vào formData
                    const blob = new Blob([fileObj]);
                    const file = new File([blob], fileObj.name || `file_${index}`);
                    formData.append('AvatarUrl', file);
                }
            });
        }

        if (data.CoverPhotoUrl && data.CoverPhotoUrl.length > 0) {
            data.CoverPhotoUrl.forEach((fileObj, index) => {
                if (fileObj.originFileObj instanceof File) {
                    console.log(fileObj);
                    // Nếu fileObj.originFileObj là một đối tượng File, thêm nó vào formData
                    formData.append('CoverPhotoUrl', fileObj.originFileObj);
                } else {
                    console.log(fileObj);
                    // Nếu không phải, tạo một đối tượng File từ fileObj và thêm vào formData
                    const blob = new Blob([fileObj]);
                    const file = new File([blob], fileObj.name || `file_${index}`);
                    formData.append('CoverPhotoUrl', file);
                }
            });
        }

        try {
            const result = await userService.updateUser(formData);
            if (result) {
                onUpdate();
                success(result);
                setFileAvatar([]);
                setFileCoverPhoto([]);
                form.resetFields();
                setVisible(false);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
        }
    };

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleChange = ({ fileList: newFileList }) => setFileAvatar(newFileList);
    const handleChange2 = ({ fileList: newFileList }) => setFileCoverPhoto(newFileList);

    const beforeUpload = () => {
        return false;
    };

    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
                cursor: 'pointer',
            }}
            type="button"
        >
            <FontAwesomeIcon icon={faFileImage} className="icon-file-image" />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Avatar
            </div>
        </button>
    );

    const uploadButton2 = (
        <button
            style={{
                border: 0,
                background: 'none',
                cursor: 'pointer',
            }}
            type="button"
        >
            <FontAwesomeIcon icon={faFileImage} className="icon-file-image" />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Cover photo
            </div>
        </button>
    );

    return (
        <>
            {contextHolder}
            <Modal open={visible} footer={null} onCancel={onClose} maskClosable={false}>
                <div className="wrapper">
                    <Form form={form}>
                        <div className="customAvatar">
                            <Form.Item name="avatar">
                                <Upload
                                    //listType="picture-card"
                                    listType="picture-circle"
                                    fileList={fileAvatar}
                                    onPreview={handlePreview}
                                    onChange={handleChange}
                                    beforeUpload={beforeUpload}
                                    accept="image/*"
                                    style={{ textAlign: 'center' }}
                                >
                                    {fileAvatar.length >= 1 ? null : uploadButton}
                                </Upload>
                                {previewImage && (
                                    <Image
                                        wrapperStyle={{
                                            display: 'none',
                                        }}
                                        preview={{
                                            visible: previewOpen,
                                            onVisibleChange: (visible) => setPreviewOpen(visible),
                                            afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                        }}
                                        src={previewImage}
                                    />
                                )}
                            </Form.Item>
                        </div>
                        <div className="customCoverPhoto">
                            <Form.Item name="coverPhotoUrl">
                                <Upload
                                    listType="picture-card"
                                    fileList={fileCoverPhoto}
                                    onPreview={handlePreview}
                                    onChange={handleChange2}
                                    beforeUpload={beforeUpload}
                                    accept="image/*"
                                    style={{ textAlign: 'center' }}
                                >
                                    {fileCoverPhoto.length >= 1 ? null : uploadButton2}
                                </Upload>
                                {previewImage && (
                                    <Image
                                        wrapperStyle={{
                                            display: 'none',
                                        }}
                                        preview={{
                                            visible: previewOpen,
                                            onVisibleChange: (visible) => setPreviewOpen(visible),
                                            afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                        }}
                                        src={previewImage}
                                    />
                                )}
                            </Form.Item>
                        </div>

                        <Form.Item name="firstName" label="First Name">
                            <Input />
                        </Form.Item>

                        <Form.Item name="lastName" label="Last Name">
                            <Input />
                        </Form.Item>
                    </Form>

                    <Button primary small className="btn-edit" onClick={handleEditUser}>
                        Edit
                    </Button>
                </div>
            </Modal>
        </>
    );
}

export default InfoModal;
