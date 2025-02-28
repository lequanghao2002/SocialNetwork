import apiClient from '~/utils/apiClient';

const authService = {
    signUp: (data) => apiClient.post('Accounts/sign-up', data),

    signIn: (data) => apiClient.post('Accounts/sign-in', data),

    externalLogin: (data) => apiClient.post('Accounts/external-login', data),

    googleLogin: (tokenId) => apiClient.post('auth/google-login', { tokenId }),
};

export default authService;
