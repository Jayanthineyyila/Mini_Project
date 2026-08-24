import express from "express";
import {
  getAllComplaints,
  updateComplaintStatus,
  assignComplaint,
  getAnalytics,
  exportComplaintsCSV,
} from "../controllers/admin.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(protect);
router.use(authorize("admin", "warden", "maintenance"));

router.get("/complaints", getAllComplaints);
router.get("/complaints/export", exportComplaintsCSV);
router.patch("/complaints/:id/status", updateComplaintStatus);
router.patch("/complaints/:id/assign", assignComplaint);
router.get("/analytics", getAnalytics);

export default router;
