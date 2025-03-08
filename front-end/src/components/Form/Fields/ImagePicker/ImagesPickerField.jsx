import React, { memo, useContext, useEffect, useState } from 'react';
import {
    PlusOutlined,
    LeftCircleOutlined,
    RightCircleOutlined,
    DeleteOutlined,
    LoadingOutlined,
} from '@ant-design/icons';
import { Button, Form, Image, Popconfirm, Upload } from 'antd';
import { DndContext, PointerSensor, useSensor } from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './ImagesPickerField.css';
import { uploadPostImage } from '~/utils/uploadHelper';
import { useNotification } from '~/context/notification/index';

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const ImagesPickerField = ({
    name,
    value,
    maxPhotos = 10,
    acceptedFormats = ['image/jpeg', 'image/png'],
    maxFileSize = 10485760,
    onChange,
}) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { success, error } = useNotification();
    const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     if (value) {
    //         setFileList(value);
    //     }
    // }, [value]);

    const DraggableUploadListItem = ({ originNode, file }) => {
        const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
            id: file.uid,
        });

        const style = {
            transform: CSS.Translate.toString(transform),
            transition,
            cursor: 'move',
            height: '102px',
            width: '102px',
            objectFit: 'cover',
            position: 'relative',
        };

        return (
            <div
                ref={setNodeRef}
                style={style}
                className={isDragging ? 'item-image is-dragging' : 'item-image'}
                {...attributes}
                {...listeners}
            >
                {file.status === 'error' && isDragging ? originNode.props.children : originNode}
                <Popconfirm
                    title="Are you sure you want to delete this image?"
                    onConfirm={() => handleRemove(file)}
                    okText="Yes"
                    cancelText="No"
                >
                    <DeleteOutlined className="btn-remove-image" />
                </Popconfirm>
            </div>
        );
    };

    const handlePreview = async (file) => {
        const index = fileList.findIndex((item) => item === file);
        setCurrentIndex(index);

        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setCurrentIndex(index);
        setPreviewOpen(true);
    };

    const handleChange = ({ fileList: newFileList }) => {
        console.log({ newFileList });
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + fileList.length) % fileList.length);
        setPreviewImage(fileList[(currentIndex - 1 + fileList.length) % fileList.length]?.url);
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % fileList.length);
        setPreviewImage(fileList[(currentIndex + 1) % fileList.length]?.url);
    };

    const sensor = useSensor(PointerSensor, {
        activationConstraint: {
            distance: 10,
        },
    });

    const onDragEnd = ({ active, over }) => {
        if (active.id !== over?.id) {
            let fileListNew;

            setFileList((prev) => {
                const activeIndex = prev.findIndex((i) => i.uid === active.id);
                const overIndex = prev.findIndex((i) => i.uid === over?.id);

                fileListNew = arrayMove(prev, activeIndex, overIndex);
                return fileListNew;
            });

            //onChange(fileListNew);
        }
    };

    var check = false;
    const handleBeforeUpload = async (file, newFileList) => {
        try {
            if (newFileList.length > maxPhotos - fileList.length) {
                if (!check) {
                    error(`You can only upload up to ${maxPhotos} files`);
                    check = true;
                }
                return Promise.reject();
            }

            if (Number(file.size) > maxFileSize) {
                error(`File size must be smaller than ${maxFileSize}`);
                return Promise.reject();
            }

            setLoading(true);
            const result = await uploadPostImage(file.originFileObj);
            const newFile = {
                id: file.uid,
                url: result,
            };

            setFileList((prevFileList) => {
                const updatedFileList = [...prevFileList, newFile];
                //onChange(updatedFileList);
                return updatedFileList;
            });
        } catch (e) {
            error('File was not uploaded. Please try again later');
        } finally {
            setLoading(false);
        }

        return Promise.reject();
    };

    const handleRemove = (file) => {
        const newFileList = fileList.filter((f) => f.id !== file.id);
        setFileList(newFileList);
        //onChange(newFileList);
    };

    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
                //color: user?.web_setting?.darkmode === 'on' ? '#fff' : '#000',
            }}
            type="button"
        >
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
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
        <Form.Item name={name}>
            <div className="custom-multi-image-picker">
                <DndContext sensors={[sensor]} onDragEnd={onDragEnd}>
                    <SortableContext items={fileList?.map((i) => i.uid)} strategy={horizontalListSortingStrategy}>
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}
                            //onRemove={handleRemove}
                            multiple
                            maxCount={maxPhotos}
                            accept={acceptedFormats}
                            beforeUpload={handleBeforeUpload}
                            itemRender={(originNode, file) => (
                                <DraggableUploadListItem originNode={originNode} file={file} />
                            )}
                            showUploadList={{
                                showRemoveIcon: false,
                            }}
                            disabled={loading}
                        >
                            {fileList?.length >= maxPhotos ? null : uploadButton}
                        </Upload>
                    </SortableContext>
                </DndContext>
                {previewImage && (
                    <div style={{}}>
                        <Image
                            style={{ position: 'relative' }}
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

                        {previewOpen && fileList.length > 1 && (
                            <div style={{ fontSize: '50px', color: '#fff' }}>
                                <LeftCircleOutlined
                                    onClick={handlePrev}
                                    style={{
                                        position: 'fixed',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        left: '50px',
                                        zIndex: 100000,
                                    }}
                                />
                                <RightCircleOutlined
                                    onClick={handleNext}
                                    style={{
                                        position: 'fixed',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        right: '50px',
                                        zIndex: 100000,
                                    }}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Form.Item>
    );
};

export default memo(ImagesPickerField);
