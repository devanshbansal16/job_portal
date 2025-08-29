import jwt from "jsonwebtoken";
import Company from "../models/Company.js";

export const protectCompany = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    const company = await Company.findById(decoded.id);
    if (!company) {
      return res.status(401).json({
        success: false,
        message: "Company not found.",
      });
    }

    req.company = company;
    next();
  } catch (err) {
    console.error("❌ Authentication error:", err.message);
    return res.status(401).json({
      success: false,
      message: "Invalid token.",
    });
  }
};
