import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectMongo } from "./src/db/db.js";
import userRouter from "./src/routes/user.route.js";
import cookieParser from "cookie-parser";
import courseRouter from "./src/routes/course.route.js";
import mediaRouter from "./src/routes/media.route.js";
import transactionRouter from "./src/routes/courseTransaction.route.js";
import courseProgressRouter from './src/routes/courseProgress.route.js';

dotenv.config();

const app = express();

connectMongo();

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/user/auth", userRouter);
app.use("/api/course", courseRouter);
app.use("/api/media", mediaRouter);
app.use("/api/purchase", transactionRouter);
app.use("/api/course-progress", courseProgressRouter);

const PORT = process.env.port || 8080;

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
