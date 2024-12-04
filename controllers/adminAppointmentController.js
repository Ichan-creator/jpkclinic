import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import schedule from "node-schedule";
import { Appointments, Notifications, User } from "../models/index.models.js";
import { Op } from "sequelize";
import sendNotificationEmail from "../utils/sendNotification.js";
import sendReminder from "../utils/sendReminder.js";

dayjs.extend(customParseFormat);

function handleAdminAppointment(req, res) {
  res.render("adminAppointment");
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
    attributes: [
      "id",
      "appointmentDate",
      "service",
      "dateApproved",
      "petNames",
    ],
    include: {
      model: User,
      attributes: ["id", "fullName"],
    },
    where: {
      dateApproved: "Pending",
    },
    raw: true,
    order: [["createdAt", "DESC"]],
  });

  if (!adminPendingAppointmentsList) return res.status(404).json([]);

  res.json(adminPendingAppointmentsList);
}

async function handleGetAdminApprovedAppointmentsList(req, res) {
  const adminAppointmentsList = await Appointments.findAll({
    attributes: [
      "id",
      "appointmentDate",
      "service",
      "dateApproved",
      "petNames",
    ],
    include: {
      model: User,
      attributes: ["id", "fullName"],
    },
    where: {
      dateApproved: { [Op.notIn]: ["PENDING", "CANCELLED"] },
    },
    raw: true,
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

  await sendNotificationEmail(service, appointmentDate, type, userId);

  await Notifications.create({
    service,
    dateAndTime: appointmentDate,
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
  handleGetAdminApprovedAppointmentsList,
  handleApproveAppointment,
};
