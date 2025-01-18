import Course from "../models/course.model";

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
    return res.status(500).json({ message: "Failed to create course"});
  }
}

export { createCourse };
