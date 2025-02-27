import apiClient from '../apiClient';

const tagService = {
    addTag: (data) => apiClient.post('Tag/add', data),
    getAllTag: () => apiClient.get('Tag/get-all'),
};

export default tagService;
