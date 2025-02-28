import apiClient from '~/utils/apiClient';

const tagService = {
    addTag: (data) => apiClient.post('Tag/add', data),
    getAllTag: () => apiClient.get('Tag/get-all'),
};

export default tagService;
