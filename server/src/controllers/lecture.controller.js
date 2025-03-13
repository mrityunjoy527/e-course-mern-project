import Course from "../models/course.model.js";
import Lecture from "../models/lecture.model.js";
import { deleteVideoFromCloudinary } from "../utils/cloudinary.js";

async function createLecture(req, res) {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;
    if (!lectureTitle)
      res.status(400).json({ message: "Lecture title is required" });
    if (!courseId) res.status(400).json({ message: "Course ID is required" });
    const course = await Course.findById(courseId);
    const lecture = await Lecture.create({ lectureTitle });
    course.lectures.push(lecture._id);
    await Course.findByIdAndUpdate(courseId, course);
    return res
      .status(200)
      .json({ message: "Lecture created successfully", lecture });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create lecture" });
  }
}

async function getCourseLectures(req, res) {
  try {
    const { courseId } = req.params;
    if (!courseId)
      return res.status(400).json({ message: "Course ID is required" });
    const course = await Course.findById(courseId).populate("lectures");
    if (!course) return res.status(404).json({ message: "Course not found" });
    return res.status(200).json({
      message: "Lectures fetched successfully",
      lectures: course.lectures,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch lectures" });
  }
}

async function updateLecture(req, res) {
  try {
    const { lectureTitle, videoInfo, isPreviewFree } = req.body;
    const { courseId, lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) return res.status(404).json({ message: "Lecture not found" });
    if (lecture.publicId) {
      await deleteVideoFromCloudinary(lecture.publicId);
    }
    lecture.isPreviewFree = isPreviewFree;
    if (lectureTitle) lecture.lectureTitle = lectureTitle;
    if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
    if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
    await lecture.save();
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (!course.lectures.includes(lectureId)) {
      course.lectures.push(lectureId);
      await course.save();
    }
    return res
      .status(200)
      .json({ message: "Lecture updated successfully", lecture });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update lecture" });
  }
}

async function removeLecture(req, res) {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findByIdAndDelete(lectureId);
    if (!lecture) return res.status(404).json({ message: "Lecture not found" });
    if (lecture.publicId) {
      await deleteVideoFromCloudinary(lecture.publicId);
    }
    await Course.updateOne(
      {
        lectures: lectureId,
      },
      { $pull: { lectures: lectureId } }
    );
    return res
      .status(200)
      .json({ message: "Lecture deleted successfully", isDeleted: true });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete lecture" });
  }
}

async function getLecture(req, res) {
  try {
    const { courseId, lectureId } = req.params;
    const course = await Course.findById(courseId);
    if (!course)
      return res
        .status(404)
        .json({ message: "Course not found"});
    const lecture = await Lecture.findById(lectureId);
    if (!lecture)
      return res
        .status(404)
        .json({ message: "Lecture not found" });
    return res.status(200).json({ lecture });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to get lecture" });
  }
}

export {
  createLecture,
  getCourseLectures,
  updateLecture,
  removeLecture,
  getLecture,
};
