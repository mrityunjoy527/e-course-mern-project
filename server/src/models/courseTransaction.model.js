import mongoose from "mongoose";

const courseTransactionSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  paymentId: {
    type: String,
    required: true,
  },
});

const courseTransaction = mongoose.model(
  "CourseTransaction",
  courseTransactionSchema
);

export default courseTransaction;