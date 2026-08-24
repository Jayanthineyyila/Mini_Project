import express from "express";
import {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  upvoteComplaint,
} from "../controllers/complaint.controller.js";
import { updateComplaintStatus } from "../controllers/admin.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(upload.single("image"), createComplaint)
  .get(getMyComplaints);

router.get("/mine", getMyComplaints);

router.route("/:id").get(getComplaintById);

router.patch("/:id/status", updateComplaintStatus);
router.post("/:id/upvote", upvoteComplaint);

export default router;
