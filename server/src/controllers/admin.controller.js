import asyncHandler from "../utils/asyncHandler.js";
import Complaint, { ISSUE_TYPES, LOCATIONS } from "../models/Complaint.js";

// @desc    Get all complaints with filters
// @route   GET /api/admin/complaints
// @access  Private (Admin/Warden)
export const getAllComplaints = asyncHandler(async (req, res) => {
  const { block, type, status, search } = req.query;

  let query = {};

  if (block) query.location = block;
  if (type) query.issueType = type;
  if (status) query.status = status;

  if (search) {
    query.$or = [
      { description: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
      { issueType: { $regex: search, $options: "i" } },
    ];
  }

  const complaints = await Complaint.find(query)
    .populate("reportedBy", "name rollNumber email hostelBlock")
    .populate("assignedTo", "name email role")
    .sort({ createdAt: -1 });

  res.json(complaints);
});

// @desc    Update complaint status
// @route   PATCH /api/admin/complaints/:id/status or /api/complaints/:id/status
// @access  Private (Admin/Warden)
export const updateComplaintStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["Pending", "Ongoing", "Resolved"].includes(status)) {
    res.status(400);
    throw new Error("Invalid status. Must be Pending, Ongoing, or Resolved.");
  }

  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found");
  }

  complaint.status = status;
  complaint.statusHistory.push({
    status,
    changedAt: new Date(),
    updatedBy: req.user._id,
  });

  await complaint.save();

  const updatedComplaint = await Complaint.findById(complaint._id)
    .populate("reportedBy", "name rollNumber email hostelBlock")
    .populate("assignedTo", "name email role");

  res.json(updatedComplaint);
});

// @desc    Assign complaint to staff
// @route   PATCH /api/admin/complaints/:id/assign
// @access  Private (Admin/Warden)
export const assignComplaint = asyncHandler(async (req, res) => {
  const { staffId } = req.body;

  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found");
  }

  complaint.assignedTo = staffId || null;
  await complaint.save();

  const updatedComplaint = await Complaint.findById(complaint._id)
    .populate("reportedBy", "name rollNumber email hostelBlock")
    .populate("assignedTo", "name email role");

  res.json(updatedComplaint);
});

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin/Warden)
export const getAnalytics = asyncHandler(async (req, res) => {
  const total = await Complaint.countDocuments();
  const pending = await Complaint.countDocuments({ status: "Pending" });
  const ongoing = await Complaint.countDocuments({ status: "Ongoing" });
  const resolved = await Complaint.countDocuments({ status: "Resolved" });

  // Issues by block / location
  const byBlockRaw = await Complaint.aggregate([
    { $group: { _id: "$location", count: { $sum: 1 } } },
  ]);

  const byBlock = LOCATIONS.map((loc) => {
    const found = byBlockRaw.find((b) => b._id === loc);
    return { name: loc, value: found ? found.count : 0 };
  });

  // Issues by type
  const byTypeRaw = await Complaint.aggregate([
    { $group: { _id: "$issueType", count: { $sum: 1 } } },
  ]);

  const byType = ISSUE_TYPES.map((t) => {
    const found = byTypeRaw.find((item) => item._id === t);
    return { name: t, value: found ? found.count : 0 };
  });

  // Calculate average resolution time (in hours)
  const resolvedComplaints = await Complaint.find({ status: "Resolved" });
  let totalHours = 0;
  let resolvedCount = 0;

  resolvedComplaints.forEach((item) => {
    const created = new Date(item.createdAt).getTime();
    const resolvedEntry = item.statusHistory.find(
      (h) => h.status === "Resolved"
    );
    const resolvedTime = resolvedEntry
      ? new Date(resolvedEntry.changedAt).getTime()
      : new Date(item.updatedAt).getTime();

    if (resolvedTime > created) {
      totalHours += (resolvedTime - created) / (1000 * 60 * 60);
      resolvedCount++;
    }
  });

  const avgResolutionHours =
    resolvedCount > 0 ? (totalHours / resolvedCount).toFixed(1) : "0.0";

  res.json({
    total,
    pending,
    ongoing,
    resolved,
    avgResolutionHours: `${avgResolutionHours} hrs`,
    byBlock,
    byType,
  });
});

// @desc    Export complaints as CSV
// @route   GET /api/admin/complaints/export
// @access  Private (Admin/Warden)
export const exportComplaintsCSV = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find()
    .populate("reportedBy", "name rollNumber email hostelBlock")
    .sort({ createdAt: -1 });

  let csv = "ID,Issue Type,Location,Status,Reported By,Roll Number,Date\n";

  complaints.forEach((c) => {
    const reporterName = c.reportedBy ? c.reportedBy.name : "N/A";
    const rollNo = c.reportedBy ? c.reportedBy.rollNumber : "N/A";
    const date = new Date(c.createdAt).toLocaleDateString();
    csv += `"${c._id}","${c.issueType}","${c.location}","${c.status}","${reporterName}","${rollNo}","${date}"\n`;
  });

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=campusfix_complaints.csv");
  res.status(200).send(csv);
});
