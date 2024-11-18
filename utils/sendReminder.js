import nodemailer from "nodemailer";
import { User } from "../models/index.models.js";

async function sendReminder(service, userId, petNames, appointmentDate) {
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
    subject: "JPK Veterinary Clinic - Appointment Reminder",
    html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <p style="font-size: 16px;">Hi <strong>${user.fullName}!,</strong></p>
            <p style="font-size: 16px;">
                This is from JPK Veterinary Clinic. We are reminding you of the scheduled appointment 
                for <strong>${service}</strong> of <strong>${petNames}</strong> today at <strong>${appointmentDate}</strong>.
            </p>
            <p style="font-size: 16px;">
                JPK Veterinary Clinic is open from 9 AM - 5 PM, Mon-Sat.
            </p>
            <p style="font-size: 16px;"><strong>Thank you.<strong></p>
        </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      throw Error(error);
    }

    console.log("Reminder email sent: " + info.response);
  });
}

export default sendReminder;