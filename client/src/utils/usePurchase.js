import { create } from "zustand";
const baseUrl = "https://skillsprint-backend-863b.onrender.com/api/purchase";

const usePurchase = create((set) => ({
  async createCheckoutSession(courseId) {
    try {
      const res = await fetch(`${baseUrl}/checkout/create-checkout-session`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  },
  async getCourseDetailsWithPurchaseStatus(courseId) {
    try {
      const res = await fetch(`${baseUrl}/course/${courseId}/details-with-status`, {
        credentials: "include",
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  },
  async getAllPurchasedCourses() {
    try {
      const res = await fetch(`${baseUrl}/`, {
        credentials: "include",
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  },
}));

export default usePurchase;
