import apiClient from '~/utils/apiClient';

const postService = {
    search: (keyword) => apiClient.get('Posts/search-post', { params: { keyword } }),
};

export default postService;
