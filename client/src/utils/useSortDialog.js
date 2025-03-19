import { create } from "zustand";

const useSortDialog = create((set) => ({
  open: false,
  toggleDialog() {
    set((state) => ({ open: !state.open }));
  },
  resetSort() {
    set({ open: false });
  },
}));

export default useSortDialog;
