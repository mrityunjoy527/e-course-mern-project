import CourseProgress from "../models/courseProgress.model.js";
import Course from "../models/course.model.js";

const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;
    const courseDetails = await Course.findById(courseId).populate("lectures");
    if (!courseDetails) {
      return res.status(404).json({ message: "Course not found" });
    }
    const courseProgress = await CourseProgress.findOne({
      userId,
      courseId,
    }).populate("courseId");
    if (!courseProgress) {
      return res.status(200).json({
        data: {
          courseDetails,
          progress: [],
          completed: false,
        },
      });
    }
    return res.status(200).json({
      data: {
        courseDetails,
        progress: courseProgress.lectureProgress,
        completed: courseProgress.completed,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateCourseProgress = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const userId = req.id;
    const courseProgress = await CourseProgress.findOne({ courseId, userId });
    if (!courseProgress) {
      courseProgress = await CourseProgress.create({
        userId,
        courseId,
        completed: false,
        lectureProgress: [],
      });
    }
    const lectureIdx = courseProgress.lectureProgress.findIndex(
      (lecture) => lecture.lectureId.toString() === lectureId
    );
    if (lectureIdx !== -1) {
      courseProgress.lectureProgress[lectureIdx].viewed = true;
    } else {
      courseProgress.lectureProgress.push({
        lectureId,
        viewed: true,
      });
    }
    const lectureProgressLength = courseProgress.lectureProgress.filter(
      (lecture) => lecture.viewed
    ).length;
    const course = await Course.findById(courseId);
    if (course.lectures.length === lectureProgressLength) {
      courseProgress.completed = true;
    }
    await courseProgress.save();
    return res
      .status(200)
      .json({ ok: true, message: "Course progress updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const markAsCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;
    const courseProgress = await CourseProgress.findOne({ courseId, userId }) ?? {};
    const course = await Course.findById(courseId);
    courseProgress.lectureProgress = [];
    course.lectures.forEach((lectureId) => {
      courseProgress.lectureProgress.push({
        lectureId,
        viewed: true,
      });
    });
    courseProgress.completed = true;
    await courseProgress.save();
    return res
      .status(200)
      .json({ ok: true, message: "Course marked as completed" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const markAsInComplete = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;
    const courseProgress = await CourseProgress.findOne({ courseId, userId }) ?? {};
    courseProgress.lectureProgress.forEach((lecture) => {
      lecture.viewed = false;
    });
    courseProgress.completed = false;
    await courseProgress.save();
    return res
      .status(200)
      .json({ ok: true, message: "Course marked as in-completed" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export {
  getCourseProgress,
  updateCourseProgress,
  markAsCompleted,
  markAsInComplete,
};
