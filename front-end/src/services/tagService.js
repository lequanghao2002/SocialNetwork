import * as httpRequest from '~/utils/httpRequest';

export const addTag = async (data) => {
    try {
        const res = await httpRequest.post('Tag/add', data);

        return res.data;
    } catch (error) {
        console.log(error);
    }
};

export const getAllTag = async () => {
    try {
        const res = await httpRequest.get('Tag/get-all');
        return res;
    } catch (error) {
        console.log(error);
    }
};
