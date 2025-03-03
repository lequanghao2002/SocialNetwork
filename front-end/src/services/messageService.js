import apiClient from '~/utils/apiClient';

const messageService = {
    getMessagesByUserId: (userId, otherUserId) =>
        apiClient.get('message/get-by-userId', { params: { userId, otherUserId } }),
};

export default messageService;
