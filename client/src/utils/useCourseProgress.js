import { create } from "zustand";
const baseUrl = "https://skillsprint-backend-863b.onrender.com/api/course-progress";

const useCourseProgress = create(() => ({
  async getCourseProgress(courseId) {
    try {
      const res = await fetch(`${baseUrl}/${courseId}`, {
        credentials: "include",
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  },
  async updateCourseProgress({ courseId, lectureId }) {
    try {
      const res = await fetch(`${baseUrl}/${courseId}/lecture/${lectureId}`, {
        credentials: "include",
        method: "PUT",
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  },
  async markAsCompleted(courseId) {
    try {
      const res = await fetch(`${baseUrl}/${courseId}/completed`, {
        credentials: "include",
        method: "PUT",
      });
      const data = await res.json();
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
  async markAsInComplete(courseId) {
    try {
      const res = await fetch(`${baseUrl}/${courseId}/incomplete`, {
        credentials: "include",
        method: "PUT",
      });
      const data = await res.json();
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
}));

export default useCourseProgress;
