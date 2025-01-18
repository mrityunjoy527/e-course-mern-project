import { create } from "zustand";

const useEditProfileDialog = create((set) => ({
  blockScroll: false,
  setScroll(option) {
    set({blockScroll: option});
  }
}));

export default useEditProfileDialog;