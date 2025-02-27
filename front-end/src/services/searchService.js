import apiClient from '../apiClient';

const postService = {
    search: (keyword) => apiClient.get('Posts/search-post', { params: { keyword } }),
};

export default postService;
