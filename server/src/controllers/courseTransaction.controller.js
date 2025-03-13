import Stripe from "stripe";
import Course from "../models/course.model.js";
import Lecture from "../models/lecture.model.js";
import User from "../models/user.model.js";
import CourseTransaction from "../models/courseTransaction.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.id;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    const newTransaction = new CourseTransaction({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
    });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.courseTitle,
              images: [course.courseThumbnail],
            },
            unit_amount: course.coursePrice * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/course-progress/${courseId}`,
      cancel_url: `${process.env.FRONTEND_URL}/course-detail/${courseId}`,
      metadata: {
        courseId: courseId,
        userId: userId,
      },
      shipping_address_collection: {
        allowed_countries: ["IN"],
      },
    });
    if (!session.url) {
      return res.status(400).json({ message: "Error while creating session" });
    }
    newTransaction.paymentId = session.id;
    await newTransaction.save();
    return res.status(200).json({
      url: session.url,
      message: "Transaction completed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

async function stripeWebhook(req, res) {
  let event;

  try {
    const payloadString = JSON.stringify(req.body, null, 2);
    const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret,
    });

    event = stripe.webhooks.constructEvent(payloadString, header, secret);
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  // Handle the checkout session completed event
  if (event.type === "checkout.session.completed") {
    console.log("check session complete is called");

    try {
      const session = event.data.object;

      const transaction = await CourseTransaction.findOne({
        paymentId: session.id,
      }).populate({ path: "courseId" });

      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      if (session.amount_total) {
        transaction.amount = session.amount_total / 100;
      }
      transaction.status = "completed";

      // Make all lectures visible by setting `isPreviewFree` to true
      if (transaction.courseId && transaction.courseId.lectures.length > 0) {
        await Lecture.updateMany(
          { _id: { $in: transaction.courseId.lectures } },
          { $set: { isPreviewFree: true } }
        );
      }

      await transaction.save();

      // Update user's enrolledCourses
      await User.findByIdAndUpdate(
        transaction.userId,
        { $addToSet: { enrolledCourses: transaction.courseId._id } }, // Add course ID to enrolledCourses
        { new: true }
      );

      // Update course to add user ID to enrolledStudents
      await Course.findByIdAndUpdate(
        transaction.courseId._id,
        { $addToSet: { enrolledStudents: transaction.userId } }, // Add user ID to enrolledStudents
        { new: true }
      );
    } catch (error) {
      console.error("Error handling event:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  return res.status(200).send();
}

async function getCourseDetailsWithPurchaseStatus(req, res) {
  try {
    const { courseId } = req.params;
    const userId = req.id;
    const course = await Course.findById(courseId)
      .populate({ path: "creator" })
      .populate({ path: "lectures" });
    if (!course)
      return res.status(404).json({ message: "Course not found", ok: false });
    const purchased = await CourseTransaction.findOne({ courseId, userId });
    return res
      .status(200)
      .json({ course, purchased: purchased ? true : false, ok: true });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch course details", ok: false });
  }
}

async function getAllPurchasedCourses(req, res) {
  try {
    const purchase = await CourseTransaction.find({
      status: "completed",
    }).populate({ path: "courseId" });
    if (!purchase) {
      return res
        .status(404)
        .json({ message: "Courses not found", purchase: [] });
    }
    return res.status(200).json({ purchase });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch purchases" });
  }
}

export {
  createCheckoutSession,
  stripeWebhook,
  getCourseDetailsWithPurchaseStatus,
  getAllPurchasedCourses,
};
