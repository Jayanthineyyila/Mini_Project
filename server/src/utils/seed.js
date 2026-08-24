import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Complaint from "../models/Complaint.js";
import { connectDB } from "../config/db.js";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log("[Seed] Clearing existing data...");
    await User.deleteMany();
    await Complaint.deleteMany();

    console.log("[Seed] Creating admin & student users...");
    const adminUser = await User.create({
      name: "Campus Maintenance Admin",
      email: "admin@rgukt.ac.in",
      password: "admin123password",
      rollNumber: "ADMIN001",
      hostelBlock: "Boys Block",
      role: "admin",
    });

    const studentUser = await User.create({
      name: "Rahul Sharma",
      email: "student@rgukt.ac.in",
      password: "student123password",
      rollNumber: "S180001",
      hostelBlock: "Bahuda",
      role: "student",
    });

    console.log(`[Seed] Admin created: ${adminUser.email}`);
    console.log(`[Seed] Student created: ${studentUser.email}`);

    console.log("[Seed] Creating sample complaints...");
    await Complaint.create([
      {
        reportedBy: studentUser._id,
        issueType: "Pipe breakage",
        location: "Bahuda",
        description: "Water pipe leaking heavily near room 204 washroom.",
        status: "Pending",
        statusHistory: [{ status: "Pending", changedAt: new Date() }],
      },
      {
        reportedBy: studentUser._id,
        issueType: "Electrical",
        location: "Mess Boys",
        description: "Main exhaust fan in mess hall is making loud noise and not working properly.",
        status: "Ongoing",
        statusHistory: [
          { status: "Pending", changedAt: new Date(Date.now() - 86400000) },
          { status: "Ongoing", changedAt: new Date() },
        ],
      },
      {
        reportedBy: studentUser._id,
        issueType: "Furniture",
        location: "New Complex Classrooms",
        description: "Broken desk in classroom 302 needs replacement.",
        status: "Resolved",
        statusHistory: [
          { status: "Pending", changedAt: new Date(Date.now() - 172800000) },
          { status: "Ongoing", changedAt: new Date(Date.now() - 86400000) },
          { status: "Resolved", changedAt: new Date() },
        ],
      },
    ]);

    console.log("[Seed] Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error]: ${error.message}`);
    process.exit(1);
  }
};

seedData();
