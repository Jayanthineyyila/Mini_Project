import asyncHandler from "../utils/asyncHandler.js";
import Complaint from "../models/Complaint.js";

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private (Student)
export const createComplaint = asyncHandler(async (req, res) => {
  const { issueType, location, description, imageUrl: bodyImageUrl } = req.body;

  if (!issueType || !location || !description) {
    res.status(400);
    throw new Error("Issue type, location, and description are required");
  }

  let imageUrl = bodyImageUrl || "";

  if (req.file) {
    if (req.file.path && req.file.path.startsWith("http")) {
      imageUrl = req.file.path; // Cloudinary URL
    } else if (req.file.buffer) {
      // Memory storage fallback: base64 Data URL
      const b64 = req.file.buffer.toString("base64");
      imageUrl = `data:${req.file.mimetype};base64,${b64}`;
    }
  }

  const complaint = await Complaint.create({
    reportedBy: req.user._id,
    issueType,
    location,
    description,
    imageUrl,
    status: "Pending",
    statusHistory: [
      {
        status: "Pending",
        changedAt: new Date(),
        updatedBy: req.user._id,
      },
    ],
  });

  const populatedComplaint = await Complaint.findById(complaint._id).populate(
    "reportedBy",
    "name rollNumber email hostelBlock"
  );

  res.status(201).json(populatedComplaint);
});

// @desc    Get my complaints
// @route   GET /api/complaints/mine or GET /api/complaints
// @access  Private
export const getMyComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find({ reportedBy: req.user._id })
    .populate("reportedBy", "name rollNumber email hostelBlock")
    .sort({ createdAt: -1 });

  res.json(complaints);
});

// @desc    Get single complaint by ID
// @route   GET /api/complaints/:id
// @access  Private
export const getComplaintById = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id)
    .populate("reportedBy", "name rollNumber email hostelBlock")
    .populate("assignedTo", "name email role")
    .populate("statusHistory.updatedBy", "name role");

  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found");
  }

  res.json(complaint);
});

// @desc    Upvote existing issue
// @route   POST /api/complaints/:id/upvote
// @access  Private
export const upvoteComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found");
  }

  const userId = req.user._id;
  const alreadyUpvoted = complaint.upvotes.includes(userId);

  if (alreadyUpvoted) {
    complaint.upvotes = complaint.upvotes.filter(
      (id) => id.toString() !== userId.toString()
    );
  } else {
    complaint.upvotes.push(userId);
  }

  await complaint.save();

  const updated = await Complaint.findById(complaint._id).populate(
    "reportedBy",
    "name rollNumber email hostelBlock"
  );

  res.json(updated);
});
