import { create } from "zustand";

const useProfileDialog = create((set) => ({
  openProfileDialog: false,
  openThemeDialog: false,
  resetDialog() {
    // console.log("Closed");
    set({ openProfileDialog: false, openThemeDialog: false });
  },
  toggleProfileDialog() {
    set((state) => {
      if (state.openThemeDialog && !state.openProfileDialog)
        return {
          openProfileDialog: true,
          openThemeDialog: false,
        };
      return { openProfileDialog: !state.openProfileDialog };
    });
  },
  toggleThemeDialog() {
    // console.log("first");
    set((state) => {
      if (!state.openThemeDialog && state.openProfileDialog)
        return {
          openProfileDialog: false,
          openThemeDialog: true,
        };
      return { openThemeDialog: !state.openThemeDialog };
    });
  },
}));

export default useProfileDialog;
