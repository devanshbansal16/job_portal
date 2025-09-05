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

    // Optional allowlist: only allow specific company emails to access recruiter endpoints
    // Configure ALLOWED_COMPANY_EMAILS as a comma-separated list in server/.env
    const allowlist = (process.env.ALLOWED_COMPANY_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    if (allowlist.length > 0) {
      const emailLower = (company.email || "").toLowerCase();
      const isAllowed = allowlist.includes(emailLower);
      if (!isAllowed) {
        return res.status(403).json({
          success: false,
          message: "Your company is not authorized to perform this action.",
        });
      }
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
