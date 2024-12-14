import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import schedule from "node-schedule";
import {
  Appointments,
  Notifications,
  Pets,
  User,
} from "../models/index.models.js";
import { Op } from "sequelize";
import sendNotificationEmail from "../utils/sendNotification.js";
import sendReminder from "../utils/sendReminder.js";

dayjs.extend(customParseFormat);

async function handleAdminAppointment(req, res) {
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

  res.render("adminAppointment", {
    notifications: formattedNotifications,
    adminName: req.user.fullName,
  });
}

async function handleGetAdminAppointmentsCalendar(req, res) {
  const appointmentsCalendar = await Appointments.findAll({
    where: { dateApproved: { [Op.ne]: "cancelled" } },
    attributes: ["service", "appointmentDate"],
    raw: true,
  });

  if (!appointmentsCalendar) return res.status(404).json([]);

  const appointments = appointmentsCalendar.map((appointment) => ({
    title: appointment.service,
    start: appointment.appointmentDate,
  }));

  res.json(appointments);
}

async function handleGetAdminPendingAppointmentsList(req, res) {
  const adminPendingAppointmentsList = await Appointments.findAll({
    attributes: ["id", "appointmentDate", "service", "dateApproved"],
    include: [
      {
        model: User,
        attributes: ["id", "fullName"],
      },
      {
        model: Pets,
        through: {
          attributes: [],
        },
        attributes: ["name"],
      },
    ],
    where: {
      dateApproved: "Pending",
    },
    order: [["createdAt", "DESC"]],
  });

  if (!adminPendingAppointmentsList) return res.status(404).json([]);

  res.json(adminPendingAppointmentsList);
}

async function handleGetAdminPetRecordsList(req, res) {
  const adminPetRecordsList = await Appointments.findAll({
    attributes: ["id", "appointmentDate", "service", "veterinarian"],
    include: {
      model: Pets,
      attributes: ["id", "animalType", "breed", "name"],
    },
    where: {
      appointmentStatus: "COMPLETE",
      medicalRecordStatus: "COMPLETE",
    },
    order: [["createdAt", "DESC"]],
  });

  if (!adminPetRecordsList) return res.status(404).json([]);

  res.json(adminPetRecordsList);
}

async function handleGetAdminApprovedAppointmentsList(req, res) {
  const adminAppointmentsList = await Appointments.findAll({
    attributes: ["id", "appointmentDate", "service", "dateApproved"],
    include: {
      model: User,
      attributes: ["id", "fullName"],
    },
    where: {
      dateApproved: { [Op.notIn]: ["PENDING", "CANCELLED"] },
    },
  });

  if (!adminAppointmentsList) return res.status(404).json([]);

  res.json(adminAppointmentsList);
}

async function handleGetAdminCancelledAppointmentsList(req, res) {
  const adminAppointmentsList = await Appointments.findAll({
    attributes: ["id", "appointmentDate", "service", "dateApproved", "note"],
    include: {
      model: User,
      attributes: ["id", "fullName"],
    },
    where: {
      dateApproved: "CANCELLED",
      appointmentStatus: "CANCELLED",
    },
    raw: true,
  });

  if (!adminAppointmentsList) return res.status(404).json([]);

  res.json(adminAppointmentsList);
}

async function handleGetAdminCompletedAppointmentsList(req, res) {
  const adminAppointmentsList = await Appointments.findAll({
    attributes: ["id", "veterinarian", "service", "appointmentDate"],
    include: [
      {
        model: User,
        attributes: ["fullName"],
      },
      {
        model: Pets,
        attributes: ["animalType", "breed", "name"],
      },
    ],
    where: {
      appointmentStatus: "COMPLETE",
      medicalRecordStatus: "COMPLETE",
    },
  });

  if (!adminAppointmentsList) return res.status(404).json([]);

  res.json(adminAppointmentsList);
}

async function handleApproveAppointment(req, res) {
  const { appointmentId, userId, appointmentDate, service, petNames, type } =
    req.body;

  const appointmentDateTime = dayjs(
    appointmentDate,
    "MMMM DD, YYYY - hh:mm A"
  ).toDate();
  const reminderTime = new Date(appointmentDateTime.getTime() - 60 * 60000);

  const jobName = `appointmentReminder-${appointmentId}`;

  if (!schedule.scheduledJobs[jobName]) {
    console.log(`Scheduling job: ${jobName} at ${reminderTime}`);

    schedule.scheduleJob(jobName, reminderTime, async () => {
      console.log(`Executing job: ${jobName}`);
      await sendReminder(service, userId, petNames, appointmentDate);
    });
  }

  const message = `Your appointment for
  <span class="font-bold text-blue-500"><strong>${service}</strong></span>
  on <span class="font-bold text-gray-600"><strong>${appointmentDate}</strong></span>
  has been <span class="${
    type === "approved" ? "text-green-500" : "text-red-500"
  }">${type}</span>.`;

  await sendNotificationEmail(message, type, userId);

  await Notifications.create({
    message,
    type,
    userId,
  });

  await Appointments.update(
    {
      dateApproved: dayjs().format("MMMM DD, YYYY hh:mm A"),
      appointmentStatus: "COMPLETE",
    },
    { where: { id: appointmentId } }
  );

  res.status(200).json({ message: "Successfully approved appointment" });
}

export {
  handleAdminAppointment,
  handleGetAdminAppointmentsCalendar,
  handleGetAdminPendingAppointmentsList,
  handleGetAdminPetRecordsList,
  handleGetAdminApprovedAppointmentsList,
  handleGetAdminCancelledAppointmentsList,
  handleGetAdminCompletedAppointmentsList,
  handleApproveAppointment,
};
