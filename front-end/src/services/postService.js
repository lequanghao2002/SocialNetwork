import apiClient from '~/utils/apiClient';

const postService = {
    get: (status, page, pageSize) => apiClient.get('Posts/get-all', { params: { status, page, pageSize } }),

    getAllByUser: (userId, page, pageSize) =>
        apiClient.get('Posts/get-all-by-user', { params: { userId, page, pageSize } }),

    getById: (id) => apiClient.get('Posts/get-by-id', { params: { id } }),

    getSavedByUser: (userId, page, pageSize) =>
        apiClient.get('Posts/get-all-post-save-by-user', { params: { userId, page, pageSize } }),

    add: (data) => apiClient.post('Posts/add', data),

    update: (data) => apiClient.put('Posts/update', data),

    delete: (id) => apiClient.delete('Posts/delete', { params: { Id: id } }),

    changeLike: (data) => apiClient.post('Posts/change-like', data),

    countShared: (id) => apiClient.get('Posts/count-shared', { params: { id } }),

    save: (data) => apiClient.post('Posts/save-post', data),
};

export default postService;
