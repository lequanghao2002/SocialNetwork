import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import app from './config';

const storage = getStorage(app);

const upload = async (file, folder, allowedTypes = null) => {
    if (!file) {
        return Promise.reject('No file selected!');
    }

    if (allowedTypes && !allowedTypes.includes(file.type)) {
        return Promise.reject('Invalid file type!');
    }

    // Tạo đường dẫn lưu ảnh trong Firebase Storage
    const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                // Có thể thêm logic để hiển thị tiến trình upload
                // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                // console.log('Upload is ' + progress + '% done');
            },
            (error) => reject('Something went wrong!' + error.code),
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL); // Trả về URL ảnh sau khi upload
                } catch (err) {
                    reject(err);
                }
            },
        );
    });
};

export default upload;
