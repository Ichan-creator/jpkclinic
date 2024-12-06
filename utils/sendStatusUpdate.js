import nodemailer from "nodemailer";
import { User } from "../models/index.models.js";

async function sendStatusUpdate(message, userId, status) {
  const user = await User.findByPk(userId, {
    attributes: ["email", "fullName"],
    raw: true,
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "jpkveterinaryclinic@gmail.com",
    to: user.email,
    subject: "JPK Veterinary Clinic - Appointment Status Updated",
    html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: ${
              status === "COMPLETE"
                ? "green"
                : status === "PENDING"
                ? "gray"
                : "yellow"
            }">Appointment ${status}</h2>
            <p style="font-size: 16px;">Hi <strong>${
              user.fullName
            }!</strong>,</p>
            <p style="font-size: 16px;">${message}</p>
        </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      throw Error(error);
    }

    console.log("Status update notification email sent: " + info.response);
  });
}

export default sendStatusUpdate;
