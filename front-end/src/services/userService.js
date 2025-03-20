import apiClient from '../utils/apiClient';

const userService = {
    getById: (id) => apiClient.get(`Users/get-by-id`, { params: { id } }),

    getListFriendship: (id) => apiClient.get('Users/get-list-friendship', { params: { id } }),

    updateProfileInfo: (data) => apiClient.put('Users/update-profile-info', data),

    updateProfileDetail: (data) => apiClient.put('Users/update-profile-detail', data),

    sendFriendRequest: (receiverId) => apiClient.post('Users/send-friend-request', null, { params: { receiverId } }),

    cancelFriendRequest: (receiverId) =>
        apiClient.post('Users/cancel-friend-request', null, { params: { receiverId } }),

    declineFriendRequest: (receiverId) =>
        apiClient.post('Users/decline-friend-request', null, { params: { receiverId } }),

    accepteFriendRequest: (receiverId) =>
        apiClient.post('Users/accept-friend-request', null, { params: { receiverId } }),

    sendUnfriendRequest: (receiverId) =>
        apiClient.post('Users/send-unfriend-request', null, { params: { receiverId } }),
};

export default userService;
