import nodemailer from "nodemailer";
import {
  jwtSecret,
  emailHost,
  emailPort,
  emailUser,
  emailPass,
  clientUrl,
} from "../constant/constant.js";

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    secure: false, // true for 465, false for other ports
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
};

// Generate 6-digit verification code
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification email
export const sendVerificationEmail = async (
  email,
  verificationCode,
  userName
) => {
  try {
    const transporter = createTransporter();

    await transporter.sendMail({
      from: "BeyondNP <kharelbaibhav7@gmail.com>",
      to: [email],
      subject: "Email Verification - Beyond NP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #4800FF; margin: 0; font-size: 28px;">Beyond NP</h1>
              <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">Your Gateway to US Universities</p>
            </div>
            
            <h2 style="color: #333; margin-bottom: 20px;">Welcome ${userName}!</h2>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              Thank you for joining Beyond NP! To complete your registration and start your journey to US universities, please verify your email address.
            </p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
              <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Your verification code is:</p>
              <div style="background-color: #4800FF; color: white; font-size: 32px; font-weight: bold; padding: 15px 30px; border-radius: 8px; letter-spacing: 5px; display: inline-block;">
                ${verificationCode}
              </div>
            </div>
            
            <p style="color: #666; font-size: 14px; margin: 25px 0;">
              <strong>Important:</strong> This code will expire in 10 minutes. If you didn't create an account with Beyond NP, please ignore this email.
            </p>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                This email was sent by Beyond NP. If you have any questions, please contact our support team.
              </p>
            </div>
          </div>
        </div>
      `,
    });

    console.log("Verification email sent successfully");
    return { success: true };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { success: false, error: error.message };
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken, userName) => {
  try {
    const transporter = createTransporter();
    const resetUrl = `${clientUrl}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: "BeyondNP <kharelbaibhav7@gmail.com>",
      to: [email],
      subject: "Reset Your Password - Beyond NP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #4800FF; margin: 0; font-size: 28px;">Beyond NP</h1>
              <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">Your Gateway to US Universities</p>
            </div>
            
            <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              Hello ${userName},<br><br>
              We received a request to reset your password. Click the button below to reset your password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #4800FF; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin: 25px 0;">
              <strong>Important:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
            </p>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                This email was sent by Beyond NP. If you have any questions, please contact our support team.
              </p>
            </div>
          </div>
        </div>
      `,
    });

    console.log("Password reset email sent successfully");
    return { success: true };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return { success: false, error: error.message };
  }
};

// Send welcome email after verification
export const sendWelcomeEmail = async (email, userName) => {
  try {
    const transporter = createTransporter();

    await transporter.sendMail({
      from: "BeyondNP <kharelbaibhav7@gmail.com>",
      to: [email],
      subject: "Welcome to Beyond NP! 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #4800FF; margin: 0; font-size: 28px;">Beyond NP</h1>
              <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">Your Gateway to US Universities</p>
            </div>
            
            <h2 style="color: #333; margin-bottom: 20px;">Welcome to Beyond NP, ${userName}! 🎉</h2>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              Congratulations! Your email has been verified and your account is now active. You're ready to start your journey to US universities.
            </p>
            
            <div style="background-color: #f0f8ff; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #4800FF; margin: 0 0 15px 0;">What's Next?</h3>
              <ul style="color: #555; margin: 0; padding-left: 20px;">
                <li>Explore and shortlist universities</li>
                <li>Create collections for your notes</li>
                <li>Track your application documents</li>
                <li>Stay organized throughout your journey</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${
                process.env.CLIENT_URL || "http://localhost:3000"
              }/dashboard" style="background-color: #4800FF; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Go to Dashboard
              </a>
            </div>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                Thank you for choosing Beyond NP. We're here to support your journey to US universities!
              </p>
            </div>
          </div>
        </div>
      `,
    });

    console.log("Welcome email sent successfully");
    return { success: true };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return { success: false, error: error.message };
  }
};
