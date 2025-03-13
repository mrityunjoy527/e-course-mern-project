import { create } from "zustand";
const baseUrl = "https://skillsprint-backend-863b.onrender.com/api/course";

const useCourse = create((set) => ({
  courses: null,
  course: null,
  resetCourses() {
    set({ courses: null });
  },
  resetCourse() {
    set({ course: null });
  },
  addNewCourse(course) {
    set((state) => ({ courses: [...state.courses, course] }));
  },
  async createCourse(course) {
    try {
      const options = {
        method: "POST",
        body: JSON.stringify(course),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await fetch(`${baseUrl}/`, options);
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  },
  async getCreatorCourses() {
    try {
      const res = await fetch(`${baseUrl}/`, { credentials: "include" });
      const data = await res.json();
      if (data?.courses) set({ courses: data.courses });
      return data;
    } catch (error) {
      console.error(error);
    }
  },
  async getCourseById(courseId) {
    try {
      const res = await fetch(`${baseUrl}/${courseId}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data?.courses) {
        set({ course: data.course });
      }
      return data;
    } catch (error) {
      console.log("error", error);
    }
  },
  async updateCourse({ formData, courseId }) {
    try {
      const options = {
        credentials: "include",
        method: "PUT",
        body: formData,
      };
      const res = await fetch(`${baseUrl}/${courseId}`, options);
      const data = await res.json();
      return data;
    } catch (error) {
      console.log("error", error);
    }
  },
  async createLecture({ lectureTitle, courseId }) {
    try {
      const options = {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lectureTitle }),
      };
      const res = await fetch(`${baseUrl}/${courseId}/lecture`, options);
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  },
  async getCourseLectures(courseId) {
    try {
      const res = await fetch(`${baseUrl}/${courseId}/lecture`, {
        credentials: "include",
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  },
  async getLecture({courseId, lectureId}) {
    try {
      const res = await fetch(`${baseUrl}/${courseId}/lecture/${lectureId}`, {
        credentials: "include",
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  },
  async removeLecture(lectureId) {
    try {
      const res = await fetch(`${baseUrl}/lecture/${lectureId}`, {
        credentials: "include",
        method: "DELETE",
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  },
  async updateLecture({ lectureData, courseId, lectureId }) {
    try {
      const res = await fetch(`${baseUrl}/${courseId}/lecture/${lectureId}`, {
        credentials: "include",
        method: "POST",
        body: JSON.stringify(lectureData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  },
  async togglePublishCourse({ courseId, query }) {
    try {
      const res = await fetch(`${baseUrl}/${courseId}?publish=${query}`, {
        credentials: "include",
        method: "PATCH",
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  },
  async getAllCourses() {
    try {
      const res = await fetch(`${baseUrl}/published-courses`);
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  },
  async getSearchedCourses({ searchQuery, categories, sortByPrice }) {
    try {
      let queryUrl = `${baseUrl}/search?query=${encodeURIComponent(
        searchQuery
      )}`;
      if (categories && categories.length > 0) {
        const categoryString = categories.map(encodeURIComponent).join(",");
        queryUrl += `&categories=${categoryString}`;
      }
      if (sortByPrice) {
        queryUrl += `&sortByPrice=${encodeURIComponent(sortByPrice)}`;
      }
      const res = await fetch(`${queryUrl}`, { credentials: "include" });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  },
  async removeCourse(courseId) {
    try {
      const res = await fetch(`${baseUrl}/${courseId}`, {
        credentials: "include",
        method: "DELETE",
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  },
}));

export default useCourse;
