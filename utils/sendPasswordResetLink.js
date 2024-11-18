import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

dotenv.config();

function sendPasswordResetLink(id, email) {
  const resetToken = jwt.sign(
    { id, iat: Math.floor(Date.now() / 1000) },
    process.env.EMAIL_TOKEN_SECRET,
    {
      expiresIn: "5m",
    }
  );

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "jpkveterinaryclinic@gmail.com",
    to: email,
    subject: "JPK Veterinary Clinic - Password Reset Request",
    html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Password Reset Request</h2>
            <p>Hello!,</p>
            <p>We received a request to reset the password for your account associated with this email address. If you made this request, please click the link below to reset your password:</p>
            <a href="${process.env.BASE_URL_DEV}/forgot-password/${resetToken}" style="background-color: #007BFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                Reset Password
            </a>
            <p>The link expires in 5 minutes. If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
            <br />
            <p>Thank you,</p>
            <p>JPK Veterinary Clinic</p>
        </div>
        `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      throw Error(error);
    }

    console.log("Password reset email sent: " + info.response);
  });
}

export default sendPasswordResetLink;