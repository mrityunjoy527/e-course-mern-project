import mongoose from "mongoose";

const lectureProgressSchema = new mongoose.Schema({
  lectureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lecture",
  },
  viewed: Boolean,
});

const courseProgressSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  completed: Boolean,
  lectureProgress: [{ type: lectureProgressSchema }],
});

const courseProgress = mongoose.model("CourseProgress", courseProgressSchema);

export default courseProgress;
