import { Request, Response } from "express";
import User from "../models/User";

export const getProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    res.json({
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar || null,
      profileCompleted: user.profileCompleted || false,
      school: user.school || null,
      course: user.course || null,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateProfile = async (req: any, res: Response) => {
  try {
    const { fullName, school, course } = req.body;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (fullName) user.fullName = fullName;
    if (school !== undefined) user.school = school;
    if (course !== undefined) user.course = course;
    if (user.fullName && user.school && user.course) {
      user.profileCompleted = true;
    }

    const updated = await user.save();
    res.json({
      id: updated._id.toString(),
      fullName: updated.fullName,
      email: updated.email,
      avatar: updated.avatar || null,
      profileCompleted: updated.profileCompleted || false,
      school: updated.school || null,
      course: updated.course || null,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/users?search=&limit=
// Returns a list of users for the student directory, excluding the requester.
export const listUsers = async (req: any, res: Response) => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const limitParam = parseInt(req.query.limit as string, 10);
    const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 100) : 50;

    const filter: any = { _id: { $ne: req.userId } }; // exclude the current user from their own directory

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { fullName: regex },
        { email: regex },
        { school: regex },
        { course: regex },
      ];
    }

    const users = await User.find(filter)
      .select("-password -verificationCode -verificationCodeExpires")
      .limit(limit)
      .sort({ createdAt: -1 });

    const data = users.map((u) => ({
      id: u._id.toString(),
      fullName: u.fullName,
      email: u.email,
      avatar: u.avatar || null,
      profileCompleted: u.profileCompleted || false,
      school: u.school || null,
      course: u.course || null,
    }));

    res.json(data);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};