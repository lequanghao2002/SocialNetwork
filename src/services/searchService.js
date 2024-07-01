import * as httpRequest from '~/utils/httpRequest';

export const search = async (keyword) => {
    try {
        const res = await httpRequest.get('Posts/search-post', {
            params: {
                keyword,
            },
        });

        return res;
    } catch (error) {
        console.log(error);
    }
};
