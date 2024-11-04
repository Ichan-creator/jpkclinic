import dayjs from "dayjs";
import schedule from "node-schedule";
import { Appointments, Notifications, User } from "../models/index.models.js";
import { Op } from "sequelize";
import sendNotificationEmail from "../utils/sendNotification.js";
import sendReminder from "../utils/sendReminder.js";

// const testTime = new Date(Date.now() + 2000);

// console.log(`Current time: ${new Date().toLocaleTimeString()}`);
// console.log(`Job scheduled for: ${testTime.toLocaleTimeString()}`);

// const testJob = schedule.scheduleJob(testTime, function () {
//   console.log(`Job triggered at: ${new Date().toLocaleTimeString()}`);
//   console.log("This is a test log to verify scheduling works!");
// });

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

async function handleGetAdminAppointmentsList(req, res) {
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
    raw: true,
  });

  if (!adminAppointmentsList) return res.status(404).json([]);

  res.json(adminAppointmentsList);
}

async function handleApproveAppointment(req, res) {
  const { appointmentId, userId, appointmentDate, service, petNames, type } =
    req.body;

  const appointmentDateTime = dayjs(appointmentDate).toDate();
  const reminderTime = new Date(appointmentDateTime.getTime() - 30 * 60000);

  const jobName = `appointmentReminder-${appointmentId}`;

  if (!schedule.scheduledJobs[jobName]) {
    schedule.scheduleJob(jobName, reminderTime, async () => {
      await sendReminder(service, userId, petNames, appointmentDate);
    });
  }

  const dateApproved = dayjs(Date.now()).utc().format("MMMM D, YYYY - h:mm A");

  await sendNotificationEmail(service, appointmentDate, type, userId);

  await Notifications.create({
    service,
    dateAndTime: dateApproved,
    type,
    userId,
  });

  await Appointments.update(
    {
      dateApproved,
      appointmentStatus: "COMPLETE",
    },
    { where: { id: appointmentId } }
  );

  res.status(200).json({ message: "Successfully approved appointment" });
}

async function handleRejectAppointment(req, res) {
  const { appointmentId, dateAndTime, userId, service, type } = req.body;

  await sendNotificationEmail(service, dateAndTime, type, userId);

  await Notifications.create({
    service,
    dateAndTime: dayjs(Date.now()).format("MMMM D, YYYY - h:mm A"),
    type: "rejected",
    userId,
  });

  await Appointments.destroy({ where: { id: appointmentId } });

  res.status(200).json({ message: "Appointment successfully rejected" });
}

export {
  handleAdminAppointment,
  handleGetAdminAppointmentsCalendar,
  handleGetAdminAppointmentsList,
  handleApproveAppointment,
  handleRejectAppointment,
};
