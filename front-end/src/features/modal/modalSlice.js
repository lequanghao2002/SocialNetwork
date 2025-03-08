import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    modals: {
        post: { isOpen: false, type: null, data: null }, // type = add || update
    },
    loading: {
        post: false,
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
