import apiClient from '~/utils/apiClient';

const postService = {
    get: (status, page, pageSize) => apiClient.get('Posts/get-all', { params: { status, page, pageSize } }),

    getAllByUserId: (userId, page, pageSize) =>
        apiClient.get('Posts/get-all-by-user-id', { params: { userId, page, pageSize } }),

    getAllSaved: (page, pageSize) => apiClient.get('Posts/get-all-saved-posts', { params: { page, pageSize } }),

    add: (data) => apiClient.post('Posts/add', data),

    update: (data) => apiClient.put('Posts/update', data),

    delete: (id) => apiClient.delete('Posts/delete', { params: { Id: id } }),

    changeLike: (data) => apiClient.post('Posts/change-like', data),

    save: (data) => apiClient.post('Posts/save', data),

    unSave: (data) => apiClient.post('Posts/unsave', data),
};

export default postService;
