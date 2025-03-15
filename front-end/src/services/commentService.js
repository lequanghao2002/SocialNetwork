import apiClient from '~/utils/apiClient';

const commentService = {
    getByPostId: (postId) => apiClient.get('Comments/get-by-postId', { params: { postId } }),
};

export default commentService;
