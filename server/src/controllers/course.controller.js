import Course from "../models/course.model.js";
import CourseTransaction from "../models/courseTransaction.model.js";
import Lecture from "../models/lecture.model.js";
import User from "../models/user.model.js";
import { deletePhotoFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

async function createCourse(req, res) {
  try {
    const { courseTitle, category } = req.body;
    if (!courseTitle || !category) {
      return req
        .status(400)
        .json({ message: "Course title and category required" });
    }
    const course = await Course.create({
      courseTitle,
      category,
      creator: req.id,
    });
    return res
      .status(201)
      .json({ message: "Course created successfully", course });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create course" });
  }
}

async function getCreatorCourses(req, res) {
  try {
    const courses = await Course.find({ creator: req.id });
    if (!courses) {
      return res.status(200).json({ message: "No course found", courses: [] });
    }
    return res
      .status(200)
      .json({ courses, message: "Courses fetched successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch courses" });
  }
}

async function getCourseById(req, res) {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    return res
      .status(200)
      .json({ course, message: "Successfully fetched course details" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch course details" });
  }
}

async function updateCourse(req, res) {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const { title, subTitle, description, category, courseLevel, coursePrice } =
      req.body;
    const thumbnail = req.file;
    if (thumbnail && course.courseThumbnail) {
      const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
      await deletePhotoFromCloudinary(publicId);
    }
    let cloudResponse;
    if (thumbnail) cloudResponse = await uploadMedia(thumbnail.path);
    const courseThumbnail = cloudResponse?.secure_url;
    const courseDetails = {};
    if (title) courseDetails.courseTitle = title;
    if (subTitle) courseDetails.subTitle = subTitle;
    if (description) courseDetails.description = description;
    if (category) courseDetails.category = category;
    if (courseLevel) courseDetails.courseLevel = courseLevel;
    if (coursePrice) courseDetails.coursePrice = coursePrice;
    if (courseThumbnail) courseDetails.courseThumbnail = courseThumbnail;
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      courseDetails,
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Course updated successfully", course: updatedCourse });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update course" });
  }
}

async function togglePublishCourse(req, res) {
  try {
    const { courseId } = req.params;
    const { publish } = req.query;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    const updated = await Course.findByIdAndUpdate(
      courseId,
      { isPublished: publish === "true" },
      { new: true }
    );
    const isPublished = publish === "true" ? "published" : "unpublished";
    return res
      .status(200)
      .json({ message: `Course is ${isPublished}`, course: updated });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update course status" });
  }
}

async function getAllCourses(req, res) {
  try {
    const courses = await Course.find({ isPublished: true }).populate({
      path: "creator",
      select: "username photoUrl",
    });
    if (!courses) return res.status(404).json({ message: "No courses found" });
    return res.status(200).json({ courses });
  } catch (error) {
    return res.status(500).json({ message: "Failed to get courses" });
  }
}

async function getSearchedCourses(req, res) {
  try {
    const { query = "", categories = [], sortByPrice = "low" } = req.query;
    const categoryArray = categories?.toString().split(",") ?? [];
    const searchCriteria = {
      isPublished: true,
      $or: [
        { courseTitle: { $regex: query, $options: "i" } },
        { subTitle: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    };
    if (categories.length > 0) {
      searchCriteria.category = {
        $in: categoryArray,
      };
    }
    const sortOptions = {};
    if (sortByPrice === "low") {
      sortOptions.coursePrice = 1;
    } else if (sortByPrice === "high") {
      sortOptions.coursePrice = -1;
    }
    const courses = await Course.find(searchCriteria)
      .populate({ path: "creator", select: "username photoUrl" })
      .sort(sortOptions);
    return res.status(200).json({ courses: courses || [] });
  } catch (error) {
    return res.status(500).json({ message: "Failed to get courses" });
  }
}

async function removeCourse(req, res) {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    await User.updateMany(
      { enrolledCourses: courseId },
      { $pull: { enrolledCourses: courseId } }
    );
    await Lecture.deleteMany({ _id: { $in: course.lectures } });
    const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
    await deletePhotoFromCloudinary(publicId);
    await CourseTransaction.deleteMany({ courseId: courseId });
    await Course.deleteOne({ _id: courseId });
    await CourseTransaction.deleteMany({ courseId: courseId });
    return res
      .status(200)
      .json({ ok: true, message: "Course deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to remove course" });
  }
}

export {
  createCourse,
  getCreatorCourses,
  getCourseById,
  updateCourse,
  togglePublishCourse,
  getAllCourses,
  getSearchedCourses,
  removeCourse,
};
