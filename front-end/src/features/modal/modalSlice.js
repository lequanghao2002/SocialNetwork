import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    modals: {
        post: { isOpen: false, type: null, data: null }, // type = add || update || share
        postDetail: { isOpen: false, type: null, data: null }, // type = add || update || share
        profileInfo: { isOpen: false, data: null },
        profileDetail: { isOpen: false, data: null },
    },
    loading: {
        post: false,
        postDetail: false,
        profileInfo: false,
        profileDetail: false,
    },
};

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openModal: (state, action) => {
            const { name, type, data = null } = action.payload;
            state.modals[name] = { isOpen: true, type, data };
        },
        closeModal: (state, action) => {
            state.modals[action.payload] = { isOpen: false, type: null, data: null };
        },
        setLoading: (state, action) => {
            const { name, isLoading } = action.payload;
            state.loading[name] = isLoading;
        },
    },
});

export const { openModal, closeModal, setLoading } = modalSlice.actions;
export default modalSlice;
