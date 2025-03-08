import { faFileImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, Image, Upload } from 'antd';
import { useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { uploadPostImage } from '~/utils/uploadHelper';

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

function ImagesPickerField({ value = [], onChange }) {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleRemove = (file) => {
        const updatedFileList = value.filter((item) => item.uid !== file.uid);
        onChange(updatedFileList);
    };

    const handleBeforeUpload = async (file) => {
        try {
            setLoading(true);

            const result = await uploadPostImage(file);
            const newFile = {
                uid: file.uid, // Dùng uid để đồng bộ với AntD
                url: result,
                name: file.name,
                status: 'done',
            };

            onChange([...value, newFile]);
        } catch (e) {
            error('File was not uploaded. Please try again later');
        } finally {
            setLoading(false);
        }

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
            {loading ? <LoadingOutlined /> : <FontAwesomeIcon icon={faFileImage} className="icon-file-image" />}
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </button>
    );

    return (
        <>
            <Upload
                listType="picture-card"
                fileList={value}
                onPreview={handlePreview}
                onRemove={handleRemove}
                beforeUpload={handleBeforeUpload}
                accept="image/*"
                multiple
                disabled={loading}
            >
                {value.length >= 2 ? null : uploadButton}
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
        </>
    );
}

export default ImagesPickerField;
