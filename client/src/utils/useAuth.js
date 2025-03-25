import { create } from "zustand";
import { authUrl } from "../ignoreUrl/url";
const baseUrl = authUrl;

const useAuth = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoggedOut: true,
  setLoggedOut(value) {
    set({ isLoggedOut: value });
  },
  setData({ user, isAuthenticated }) {
    set({ user, isAuthenticated });
  },
  async registerUser(userdata) {
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
      if (data?.user)
        set(() => ({
          user: data.user,
          isAuthenticated: false,
        }));
      return data;
    } catch (error) {
      console.error(error);
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
      return data;
    } catch (error) {
      console.error(error);
    }
  },
  async getUser() {
    try {
      const res = await fetch(`${baseUrl}/profile`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data?.user) set(() => ({ user: data.user, isAuthenticated: true }));
      return data;
    } catch (error) {
      console.error(error);
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
      if (data?.user) set(() => ({ user: data.user, isAuthenticated: true }));
      return data;
    } catch (error) {
      console.error(error);
    }
  },
  async logoutUser() {
    try {
      const res = await fetch(`${baseUrl}/logout`, { credentials: "include" });
      const data = await res.json();
      if (data?.isLoggedOut)
        set(() => ({ user: null, isAuthenticated: false }));
      return data;
    } catch (error) {
      console.log("error", error);
    }
  },
  async makeInstructor(info) {
    try {
      const options = {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(info),
      };
      const res = await fetch(`${baseUrl}/profile`, options);
      const data = await res.json();
      return data;
    } catch (error) {
      console.log("error", error);
    }
  },
}));

export default useAuth;
