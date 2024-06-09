// import * as httpRequest from '~/utils/httpRequest';

// export const addPost = async (data) => {
//     try {
//         const res = await httpRequest.post('Posts/add', {
//             params: {
//                 AddPostDTO: data,
//             },
//         });

//         return res.data;
//     } catch (error) {
//         console.log(error);
//     }
// };

import * as httpRequest from '~/utils/httpRequest';

export const getAllPost = async (page, pageSize) => {
    try {
        const res = await httpRequest.get('Posts/get-all', {
            params: {
                page,
                pageSize,
            },
        });
        return res;
    } catch (error) {
        console.error('There was an error!', error);
        return null;
    }
};

export const addPost = async (data) => {
    try {
        const res = await httpRequest.post('Posts/add', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return res;
    } catch (error) {
        console.error('There was an error!', error);
        return null;
    }
};

export const updatePost = async (data) => {
    try {
        const res = await httpRequest.put('Posts/update', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return res;
    } catch (error) {
        console.error('There was an error!', error);
        return null;
    }
};

export const deletePost = async (Id) => {
    try {
        const res = await httpRequest.del(
            'Posts/delete',
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
