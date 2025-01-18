import { create } from "zustand";
const baseUrl = "http://localhost:8080/api/user/auth";

const useAuth = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoggedOut: false,
  setLoggedOut(value) {
    set({isLoggedOut: value});
  },
  setData({ user, isAuthenticated }) {
    set({ user, isAuthenticated });
  },
  async registerUser(userdata) {
    set({ isLoading: true });
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userdata),
      };
      const res = await fetch(`${baseUrl}/register`, options);
      const data = await res.json();
      if (data?.user) {
        set(() => ({
          user: data.user,
          isAuthenticated: false,
        }));
      }
      return data;
    } catch (error) {
      console.log("error", error);
    }
  },
  async loginUser(userdata) {
    try {
      const options = {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userdata),
      };
      const res = await fetch(`${baseUrl}/login`, options);
      const data = await res.json();
      if (data?.user) {
        set(() => ({ user: data.user, isAuthenticated: true }));
      }
      return data;
    } catch (error) {
      console.log("error", error);
    }
  },
  async getUser() {
    try {
      const res = await fetch(`${baseUrl}/profile`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data?.user) {
        set(() => ({ user: data.user, isAuthenticated: true }));
      }
      return data;
    } catch (error) {
      console.log("error", error);
    }
  },
  async updateProfile(formData) {
    try {
      const options = {
        credentials: "include",
        method: "PUT",
        body: formData,
      };
      const res = await fetch(`${baseUrl}/profile/update`, options);
      const data = await res.json();
      if (data?.user) {
        set(() => ({ user: data.user, isAuthenticated: true }));
      }
      return data;
    } catch (error) {
      console.log("error", error);
    }
  },
  async logoutUser() {
    try {
      const res = await fetch(`${baseUrl}/logout`, { credentials: "include" });
      const data = await res.json();
      set(() => ({ user: null, isAuthenticated: false }));
      return data;
    } catch (error) {
      console.log("error", error);
    }
  },
}));

export default useAuth;
