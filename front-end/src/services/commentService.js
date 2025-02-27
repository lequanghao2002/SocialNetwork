import apiClient from '../apiClient';

const commentService = {
    getAll: (postId) => apiClient.get('Comments/get-list-comment', { params: { postId } }),

    add: (data) => apiClient.post('Comments/create-comment', data),

    update: (data) => apiClient.put('Comments/update-comment', data),

    delete: (id) => apiClient.delete('Comments/delete-comment', { params: { Id: id } }),
};

export default commentService;
