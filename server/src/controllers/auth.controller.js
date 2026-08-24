import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = asyncHandler(async (req, res) => {
  const { name, email, password, rollNumber, hostelBlock, role } = req.body;

  if (!name || !email || !password || !rollNumber || !hostelBlock) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }

  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists with this email");
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    rollNumber,
    hostelBlock,
    role: role || "student",
  });

  if (user) {
    const token = generateToken(user._id);
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      rollNumber: user.rollNumber,
      hostelBlock: user.hostelBlock,
      role: user.role,
      createdAt: user.createdAt,
    };

    res.status(201).json({
      success: true,
      token,
      user: userData,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id);
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      rollNumber: user.rollNumber,
      hostelBlock: user.hostelBlock,
      role: user.role,
      createdAt: user.createdAt,
    };

    res.json({
      success: true,
      token,
      user: userData,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json({
    success: true,
    _id: user._id,
    name: user.name,
    email: user.email,
    rollNumber: user.rollNumber,
    hostelBlock: user.hostelBlock,
    role: user.role,
    createdAt: user.createdAt,
  });
});
