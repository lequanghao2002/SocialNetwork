import * as httpRequest from '~/utils/httpRequest';

export const getUserById = async (id) => {
    try {
        const res = await httpRequest.get('Users/get-by-id', {
            params: {
                id,
            },
        });
        return res;
    } catch (error) {
        console.error('There was an error!', error);
        return null;
    }
};

export const updateUserProfile = async (data) => {
    try {
        const res = await httpRequest.post('Users/update-user-profile', data);
        return res;
    } catch (error) {
        console.error('There was an error!', error);
        return null;
    }
};

export const getStatusFriend = async (userId, friendId) => {
    try {
        const res = await httpRequest.get('Users/get-status-friend', {
            params: {
                userId,
                friendId,
            },
        });
        return res;
    } catch (error) {
        console.error('There was an error!', error);
        return null;
    }
};

export const changeStatusFriend = async (data) => {
    try {
        const res = await httpRequest.post('Users/change-status-friend', data);
        return res;
    } catch (error) {
        console.error('There was an error!', error);
        return null;
    }
};

export const getListFriendship = async (Id) => {
    try {
        const res = await httpRequest.get('Users/get-list-friendship', {
            params: {
                Id,
            },
        });
        return res;
    } catch (error) {
        console.error('There was an error!', error);
        return null;
    }
};
