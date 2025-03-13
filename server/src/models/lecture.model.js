import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    lectureTitle: {
      type: String,
      require: true,
    },
    videoUrl: { type: String },
    isPreviewFree: { type: Boolean },
    publicId: { type: String },
  },
  { timestamps: true }
);

const Lecture = mongoose.model("Lecture", lectureSchema);

export default Lecture;
