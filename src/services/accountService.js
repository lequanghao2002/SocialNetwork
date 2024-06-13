import * as httpRequest from '~/utils/httpRequest';

export const signUp = async (data) => {
    try {
        const res = await httpRequest.post('Accounts/sign-up', data, {});
        return res;
    } catch (error) {
        console.error('There was an error!', error);
        return null;
    }
};

export const signIn = async (data) => {
    try {
        const res = await httpRequest.post('Accounts/sign-in', data, {});
        return res;
    } catch (error) {
        console.error('There was an error!', error);
        return null;
    }
};

export const externalLogin = async (data) => {
    try {
        const res = await httpRequest.post('Accounts/external-login', data, {});
        return res;
    } catch (error) {
        console.error('There was an error!', error);
        return null;
    }
};
