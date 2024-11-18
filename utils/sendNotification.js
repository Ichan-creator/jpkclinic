import nodemailer from "nodemailer";
import { User } from "../models/index.models.js";

async function sendNotificationEmail(service, appointmentDate, type, userId) {
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
              type === "approved" ? "#4CAF50" : "red"
            }">Appointment ${type}</h2>
            <p style="font-size: 16px;">Hi <strong>${
              user.fullName
            }!</strong>,</p>
            <p style="font-size: 16px;">
                Your appointment for <strong>${service}</strong> at <strong>${appointmentDate}</strong> has been <span style="color: ${
      type === "approved" ? "#4CAF50" : "red"
    }">${type}</span>.
            </p>
        </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      throw Error(error);
    }

    console.log("Notification email sent: " + info.response);
  });
}

export default sendNotificationEmail;
