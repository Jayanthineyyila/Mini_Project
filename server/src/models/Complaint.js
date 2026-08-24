import mongoose from "mongoose";

export const ISSUE_TYPES = [
  "Pipe breakage",
  "Broken tap",
  "Electrical",
  "Furniture",
  "Road patch",
  "Other",
];

export const LOCATIONS = [
  "Girls Block-1",
  "Girls Block-2",
  "Boys Block",
  "Mess Girls",
  "Mess Boys",
  "New Complex Classrooms",
  "Bahuda",
  "Akshaya",
  "Nagavalli",
  "Mahendra Tanaya",
  "Suvarnamukhi",
  "Champavathi",
  "Vegavathi",
];

export const STATUSES = ["Pending", "Ongoing", "Resolved"];

const complaintSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    issueType: {
      type: String,
      enum: ISSUE_TYPES,
      required: [true, "Issue type is required"],
    },
    location: {
      type: String,
      enum: LOCATIONS,
      required: [true, "Location is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: STATUSES,
      default: "Pending",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: STATUSES,
          required: true,
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;
