import { createSlice } from "@reduxjs/toolkit";

const modalInfo = {
  isModalOpen: false,
  modalType: "",
  // url: "",
  // title: "",
  // memo: "",
  // hashTag: "",
  // myFav: false,
  // id: 0,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState: modalInfo,
  reducers: {
    OPEN_MODAL: (state, action) => {
      state.isModalOpen = true;
    },
    CLOSE_MODAL: (state, action) => {
      state.isModalOpen = false;
    },
    SET_MODAL_TYPE: (state, action) => {
      state.modalType = action.payload;
    },
  },
});

export const { OPEN_MODAL, CLOSE_MODAL, SET_MODAL_TYPE } = modalSlice.actions;

export default modalSlice.reducer;

// Slice
export const getIsModalOpen = (state) => state.modal.isModalOpen;
export const getModalType = (state) => state.modal.modalType;
export const getModalInfo = (state) => state.modal;
