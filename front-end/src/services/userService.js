import apiClient from '../utils/apiClient';

const userService = {
    getUserById: (id) => apiClient.get(`Users/get-by-id/${id}`),

    updateUserProfile: (data) => apiClient.put('Users/update-user-profile', data),

    updateUser: (data) =>
        apiClient.put('Users/update-user', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }),

    getStatusFriend: (userId, friendId) => apiClient.get('Users/get-status-friend', { params: { userId, friendId } }),

    changeStatusFriend: (data) => apiClient.post('Users/change-status-friend', data),

    getListFriendship: (id) => apiClient.get('Users/get-list-friendship', { params: { id } }),
};

export default userService;
