import * as httpRequest from '~/utils/httpRequest';

export const getAllComment = async (postId) => {
    try {
        const res = await httpRequest.get('Comments/get-list-comment', {
            params: {
                postId,
            },
        });
        return res;
    } catch (error) {
        console.error('There was an error!', error);
        return null;
    }
};

export const addComment = async (data) => {
    try {
        const res = await httpRequest.post('Comments/create-comment', data, {});

        return res;
    } catch (error) {
        console.error('There was an error!', error);
        return null;
    }
};

export const updateComment = async (data) => {
    try {
        const res = await httpRequest.put('Comments/update-comment', data);
        return res;
    } catch (error) {
        console.error('There was an error!', error);
        return null;
    }
};

export const deleteComment = async (Id) => {
    try {
        const res = await httpRequest.del(
            'Comments/delete-comment',
            {
                params: {
                    Id,
                },
            },
            {},
        );

        return res;
    } catch (error) {
        console.error('There was an error!', error);
        return null;
    }
};
