import dotenv from "dotenv";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

dotenv.config();

const BASE_URL_DEV = process.env.BASE_URL_DEV;

function sendVerifyEmail(email, EMAIL_TOKEN_SECRET) {
  const verifyEmailToken = jwt.sign(
    { email, iat: Math.floor(Date.now() / 1000) },
    EMAIL_TOKEN_SECRET,
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

  const verifyEmailLink = `${BASE_URL_DEV}/verify/${verifyEmailToken}`;

  const mailOptions = {
    from: "jpkveterinaryclinic@gmail.com",
    to: email,
    subject: "JPK Veterinary Clinic - Verify Account Email",
    html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #4CAF50;">Verify Your Email</h2>
            <p style="font-size: 16px;">Hi there!,</p>
            <p style="font-size: 16px;">
                Thank you for signing up for an account in <strong>JPK Veterinary Clinic</strong>! 
                To complete your registration and access your account, please verify your email address by clicking the button below:
            </p>
            <a href="${verifyEmailLink}" 
               style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
               Verify Email
            </a>
            <p style="font-size: 14px; color: #777; margin-top: 20px;">
                This verify link expires in 5 minutes. <br />
                If you didn't create an account, you can safely ignore this email.
            </p>
            <p style="font-size: 14px; color: #777;">
                Best regards,<br/>
                JPK Veterinary Clinic
            </p>
        </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      throw Error(error);
    }

    console.log("Email sent: " + info.response);
  });
}

export default sendVerifyEmail;