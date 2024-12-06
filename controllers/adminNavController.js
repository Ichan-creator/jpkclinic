import { Op } from "sequelize";
import {
  Appointments,
  Pets,
  User,
  Notifications,
} from "../models/index.models.js";
import sendNotificationEmail from "../utils/sendNotification.js";
import dayjs from "dayjs";

async function handleAdminNav(req, res) {
  const pendingAppointments = await Appointments.count({
    where: {
      appointmentStatus: "PENDING",
    },
    raw: true,
  });

  const confirmedAppointments = await Appointments.count({
    where: {
      dateApproved: {
        [Op.notIn]: ["Pending", "cancelled"],
      },
    },
    raw: true,
  });

  const cancelledAppointments = await Appointments.count({
    where: {
      appointmentStatus: "CANCELLED",
    },
    raw: true,
  });

  const notifications = await Notifications.findAll({
    where: { type: "admin" },
    order: [["createdAt", "DESC"]],
    raw: true,
  });

  const formattedNotifications = notifications.map((notification) => {
    return {
      ...notification,
      timeAgo: dayjs(notification.createdAt).fromNow(),
    };
  });

  res.render("adminNav", {
    pendingAppointments,
    confirmedAppointments,
    cancelledAppointments,
    notifications: formattedNotifications,
    adminName: req.user.fullName,
  });
}

async function handleGetAdminAppointmentRequests(req, res) {
  const appointmentRequests = await Appointments.findAll({
    attributes: [
      "id",
      "veterinarian",
      "appointmentStatus",
      "appointmentDate",
      "service",
    ],
    include: {
      model: Pets,
      attributes: ["name", "animalType"],
      include: { model: User, attributes: ["id", "fullName"] },
    },
    raw: true,
  });

  res.json(appointmentRequests);
}

async function handleGetAdminMedicalRecords(req, res) {
  const adminMedicalRecords = await Appointments.findAll({
    attributes: ["veterinarian", "service", "medicalRecordStatus"],
    include: {
      model: Pets,
      attributes: ["name", "animalType"],
    },
    raw: true,
    where: { appointmentStatus: { [Op.ne]: "cancelled" } },
  });

  res.json(adminMedicalRecords);
}

async function handleCancelAppointment(req, res) {
  const { appointmentId, appointmentDate, userId, service, type } = req.body;

  const message = `Your appointment for
  <span class="font-bold text-blue-500"><strong>${service}</strong></span>
  on <span class="font-bold text-gray-600"><strong>${appointmentDate}</strong></span>
  has been <span class="${
    type === "approved" ? "text-green-500" : "text-red-500"
  }">${type}</span>. You may reschedule the said appointment.`;

  const notificationMessage = `Your appointment for ${service}
  at ${appointmentDate} has been ${type}. You may now reschedule the said appointment.`;

  await sendNotificationEmail(notificationMessage, type, userId);

  await Notifications.create({
    message,
    userId,
  });

  await Appointments.update(
    {
      appointmentStatus: "CANCELLED",
    },
    { where: { id: appointmentId } }
  );

  res.status(200).json({ message: "Appointment successfully cancelled" });
}

export {
  handleAdminNav,
  handleGetAdminAppointmentRequests,
  handleGetAdminMedicalRecords,
  handleCancelAppointment,
};
