import { config } from "dotenv";
config();

// Import all environment variables
export const port = process.env.PORT || 8000;
export const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/beyondnp";
export const jwtSecret =
  process.env.JWT_SECRET ||
  "your_super_secret_jwt_key_here_change_this_in_production";

// Email configuration
export const emailHost = process.env.EMAIL_HOST || "smtp.gmail.com";
export const emailPort = process.env.EMAIL_PORT || 587;
export const emailUser = process.env.EMAIL_USER || "kharelbaibhav7@gmail.com";
export const emailPass = process.env.EMAIL_PASS || "";

// Client URL
export const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
