import express from "express";
import { isAuthenticated } from "../utils/jwt.js";
import {
  createCheckoutSession,
  getAllPurchasedCourses,
  getCourseDetailsWithPurchaseStatus,
  stripeWebhook,
} from "../controllers/courseTransaction.controller.js";
const router = express.Router();

router.post(
  "/checkout/create-checkout-session",
  isAuthenticated,
  createCheckoutSession
);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);
router.get(
  "/course/:courseId/details-with-status",
  isAuthenticated,
  getCourseDetailsWithPurchaseStatus
);
router.get("/", isAuthenticated, getAllPurchasedCourses);

export default router;
