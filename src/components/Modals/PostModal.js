import React, { useContext, useEffect, useRef, useState, Spin } from 'react';
import { Form, Input, Modal, Button, Dropdown, Space, Select, Image, Upload } from 'antd';
import Avatar from '~/components/Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronDown,
    faEarthAsia,
    faFileImage,
    faLock,
    faSpinner,
    faUserGroup,
} from '@fortawesome/free-solid-svg-icons';

import * as postService from '~/services/postService';
import * as tagService from '~/services/tagService';
import { AppContext } from '~/context/AppProvider';
import './PostModal.css';
import * as modePostConstant from '~/constant';

const items = [
    {
        label: 'Public',
        key: '1',
        icon: <FontAwesomeIcon icon={faEarthAsia} />,
    },
    {
        label: 'Friend',
        key: '2',
        icon: <FontAwesomeIcon icon={faUserGroup} />,
    },
    {
        label: 'Private',
        key: '3',
        icon: <FontAwesomeIcon icon={faLock} />,
    },
];

function PostModal({ onSubmit }) {
    const { isPostModalVisible, setIsPostModalVisible, postCurrent, setPostCurrent, modePost, setModePost } =
        useContext(AppContext);
    //const { isPostModalVisible, setIsPostModalVisible } = useContext(AppContext);
    const [content, setContent] = useState('');
    const [statusPost, setStatusPost] = useState(items[0]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);
    const [listTag, setListTag] = useState([]);
    const [selectedTag, setSelectedTag] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const inputRef = useRef();

    useEffect(() => {
        if (isPostModalVisible) {
            setTimeout(() => {
                inputRef.current && inputRef.current.focus();
            }, 0);

            if (postCurrent) {
                form.setFieldsValue({ Content: postCurrent.content });
                console.log(postCurrent);
                const statusPostUpdate = items.find((item) => item.key == postCurrent.status);
                console.log(statusPostUpdate);
                if (statusPostUpdate) {
                    setStatusPost({
                        label: statusPostUpdate.label,
                        key: statusPostUpdate.key,
                        icon: statusPostUpdate.icon,
                    });
                }

                if (postCurrent.images) {
                    const imageArray = JSON.parse(postCurrent.images);

                    const fileList = imageArray.map((img, index) => ({
                        uid: index,
                        name: img.split('/').pop(),
                        url: `${process.env.REACT_APP_BASE_URL2}${img}`,
                    }));

                    console.log(fileList);
                    setFileList(fileList);
                } else {
                    setFileList([]);
                }

                if (postCurrent.listTag) {
                    const newSelectedTag = postCurrent.listTag.map((element) => ({
                        value: element.name,
                        label: element.name,
                    }));
                    setSelectedTag(newSelectedTag);
                } else {
                    setSelectedTag([]);
                }
            }
        } else {
            setPostCurrent([]);
            form.resetFields();
            setFileList([]);
            setSelectedTag([]);
            setStatusPost({
                label: 'Public',
                key: '1',
                icon: <FontAwesomeIcon icon={faEarthAsia} />,
            });
        }
    }, [isPostModalVisible]);

    useEffect(() => {
        const fetchApi = async () => {
            const result = await tagService.getAllTag();
            if (result) {
                const newListTag = result.map((element) => ({
                    value: element.name,
                    label: element.name,
                }));
                setListTag(newListTag);
            } else {
                console.log(result);
            }
        };
        fetchApi();
    }, []);

    // ---------------------------------- Content post ----------------------------------
    const handleOk = () => {
        setLoading(true);
        var dataForm = form.getFieldsValue();
        var data = { ...dataForm, Status: statusPost.key, FileList: fileList, TagList: selectedTag };
        // Tạo đối tượng FormData
        const formData = new FormData();

        // Thêm các trường dữ liệu vào formData
        formData.append('Content', data.Content);
        formData.append('Status', data.Status);

        //Thêm các tệp vào formData
        // if (data.FileList && data.FileList.length > 0) {
        //     data.FileList.forEach((fileObj, index) => {
        //         formData.append('FileList', fileObj.originFileObj); // Sử dụng originFileObj để lấy tệp thực tế
        //     });
        // }

        if (data.FileList && data.FileList.length > 0) {
            data.FileList.forEach((fileObj, index) => {
                if (fileObj.originFileObj instanceof File) {
                    console.log(fileObj);
                    // Nếu fileObj.originFileObj là một đối tượng File, thêm nó vào formData
                    formData.append('FileList', fileObj.originFileObj);
                } else {
                    console.log(fileObj);
                    // Nếu không phải, tạo một đối tượng File từ fileObj và thêm vào formData
                    const blob = new Blob([fileObj]);
                    const file = new File([blob], fileObj.name || `file_${index}`);
                    formData.append('FileList', file);
                }
            });
        }

        // if (data.FileList && data.FileList.length > 0) {
        //     data.FileList.forEach((fileObj, index) => {
        //         if (fileObj.originFileObj instanceof File) {
        //             // Nếu fileObj.originFileObj là một đối tượng File, thêm nó vào formData
        //             formData.append('FileList', fileObj.originFileObj);
        //         } else {
        //             // Nếu không phải, chuyển đổi fileObj thành một đối tượng File và thêm vào formData
        //             const file = new File([fileObj.url], fileObj.name || `file_${index}`);
        //             formData.append('FileList', file);
        //         }
        //     });
        // }

        console.log(fileList);

        // Thêm các tag (nếu có) vào formData
        if (data.TagList && data.TagList.length > 0) {
            data.TagList.forEach((tag, index) => {
                formData.append(`TagList`, tag);
            });
        }

        console.log(data);

        const fetchApi = async () => {
            try {
                let result = null;

                if (modePost === modePostConstant.modeAdd) {
                    result = await postService.addPost(formData);
                } else if (modePost === modePostConstant.modeUpdate) {
                    formData.append('Id', postCurrent.id);
                    console.log(formData);
                    result = await postService.updatePost(formData);
                } else {
                    console.log('result is null');
                }

                if (result != null) {
                    console.log(result);
                    setIsPostModalVisible(false);
                    onSubmit(result);
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                form.resetFields();
                setFileList([]);
                setSelectedTag([]);
                setStatusPost([]);
                setIsPostModalVisible(false);
                setLoading(false);
            }
        };
        fetchApi();
    };

    const handleCancel = () => {
        setIsPostModalVisible(false);
    };

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    // ---------------------------------- Status post ----------------------------------
    const handleMenuClick = (e) => {
        const item = items.find((item) => item.key === e.key);
        setStatusPost({ label: item.label, key: item.key, icon: item.icon });
    };

    const menuProps = {
        items,
        onClick: handleMenuClick,
    };

    // ---------------------------------- Tag post ----------------------------------
    const handleChangeTags = (value) => {
        setSelectedTag(value);
    };

    // ---------------------------------- Image post ----------------------------------
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

    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
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
                Upload
            </div>
        </button>
    );

    return (
        <div>
            <Modal
                width={600}
                open={isPostModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Post"
                footer={[
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleOk}
                        className={content.trim() ? 'customFooterButton' : 'customFooterButtonDisable'}
                        disabled={!content.trim() || loading}
                        loading={loading}
                    >
                        Post
                    </Button>,
                ]}
                cancelButtonProps={{ style: { display: 'none' } }}
                maskClosable={false} // Disable mask closing when loading
                closable={!loading} // Disable close button when loading
            >
                {loading && (
                    <div className="loading-overlay">
                        <FontAwesomeIcon icon={faSpinner} className="search-loading" />
                        <span>Posting</span>
                    </div>
                )}{' '}
                {/* Loading overlay */}
                <h2 className="title-post">{modePost} post</h2>
                <div className="body-post">
                    <Avatar src="https://scontent.fdad3-1.fna.fbcdn.net/v/t39.30808-1/444153590_1990476318021855_5038580475676609884_n.jpg?stp=dst-jpg_p200x200&_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeFD4LSsf4oaed2X7wme9M_LEKooY9h7LowQqihj2HsujFoSKNMInw6IgnF57NubvJ4L_WACDBRV4-r3nYPi2wmE&_nc_ohc=3EcukDdHMJgQ7kNvgHmQJaK&_nc_ht=scontent.fdad3-1.fna&oh=00_AYDXT4W-TeMGhYVoAXyZfe9vzuBY_VypvFY2FzLvMwrFzQ&oe=66551247" />
                    <div className="info-post">
                        <span className="name">Lê Quang Hào</span>
                        <Dropdown menu={menuProps}>
                            <Button className="customButton">
                                <Space>
                                    {statusPost.icon}
                                    {statusPost.label}
                                    <FontAwesomeIcon icon={faChevronDown} />
                                </Space>
                            </Button>
                        </Dropdown>
                    </div>
                </div>
                <Form form={form}>
                    <Form.Item name="Content">
                        <Input.TextArea
                            ref={inputRef}
                            className="customTextArea"
                            onChange={handleContentChange}
                            placeholder="Share your programming knowledge here..."
                        />
                    </Form.Item>
                </Form>
                <Form.Item>
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                        beforeUpload={beforeUpload}
                        accept="image/*"
                        multiple
                    >
                        {fileList.length >= 100 ? null : uploadButton}
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
                <Form.Item>
                    <Select
                        className="customSelectTag"
                        mode="tags"
                        style={{ width: '100%' }}
                        placeholder="Add tag..."
                        onChange={handleChangeTags}
                        value={selectedTag}
                        options={listTag}
                    />
                </Form.Item>
            </Modal>
        </div>
    );
}

export default PostModal;
