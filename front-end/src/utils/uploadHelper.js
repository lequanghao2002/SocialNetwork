import upload from '~/firebase/upload';

export const uploadPostImage = (file) => {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return upload(file, 'posts', allowedImageTypes);
};

export const uploadChatImage = (file) => {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return upload(file, 'chats', allowedImageTypes);
};

export const uploadChatFile = (file) => {
    return upload(file, 'chats');
};
