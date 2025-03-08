import React, { useState, useEffect } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Image, Upload } from 'antd';
import { useNotification } from 'context/notification';
import ImageService from 'services/image';

import './ImagePicker.css';

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const ImagePicker = ({ value, onChange, acceptedFormats = ['image/jpeg', 'image/png'], maxFileSize = 10485760 }) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);
    const { success, error } = useNotification();

    useEffect(() => {
        if (value) {
            setFileList(value);
        }
    }, [value]);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleBeforeUpload = async (file, newFileList) => {
        try {
            if (Number(file.size) > maxFileSize) {
                error(`File size must be smaller than ${maxFileSize}`);
                return Promise.reject();
            }

            const result = await uploadImage(file);
            const newFile = {
                id: result.id,
                url: result.url,
            };

            setFileList([newFile]);
            onChange([newFile]);
        } catch (e) {
            error('File was not uploaded. Please try again later');
        } finally {
        }

        return Promise.reject();
    };

    const uploadImage = async (file) => {
        const imageService = new ImageService();
        try {
            const formData = new FormData();
            formData.append('file', file);

            const result = await imageService.upload(formData);
            return result;
        } catch (error) {
            error('File  was not uploaded. Please try again later');
            throw error;
        }
    };

    return (
        <div className="custom_upload_image">
            <Upload
                listType="picture"
                fileList={fileList}
                onPreview={handlePreview}
                beforeUpload={handleBeforeUpload}
                accept={acceptedFormats}
                showUploadList={{
                    showRemoveIcon: false,
                }}
            >
                <Button type="primary" icon={<UploadOutlined />}>
                    Upload
                </Button>
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
        </div>
    );
};
export default ImagePicker;
