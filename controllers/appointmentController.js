import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import { Op } from "sequelize";
import { Appointments, Notifications, Pets } from "../models/index.models.js";

dayjs.extend(relativeTime);

async function handleAppointment(req, res) {
  const userDetails = req.user;

  const userPets = await Pets.findAll({
    attributes: ["name", "gender", "birthday", "animalType", "breed"],
    where: { userId: req.user.id },
    raw: true,
  });

  const notifications = await Notifications.findAll({
    where: { userId: req.user.id },
    order: [["createdAt", "DESC"]],
    raw: true,
  });

  const formattedNotifications = notifications.map((notification) => {
    return {
      ...notification,
      timeAgo: dayjs(notification.createdAt).fromNow(),
    };
  });

  res.render("appointment", {
    ...userDetails,
    userPets,
    notifications: formattedNotifications,
  });
}

async function handleGetAppointmentsCalendar(req, res) {
  const appointmentsCalendar = await Appointments.findAll({
    attributes: ["service", "appointmentDate"],
    where: {
      userId: req.user.id,
      dateApproved: { [Op.notIn]: ["CANCELLED", "Pending"] },
    },
    raw: true,
  });

  if (!appointmentsCalendar) return res.status(404).json([]);

  const appointments = appointmentsCalendar.map((appointment) => ({
    title: appointment.service,
    start: appointment.appointmentDate,
  }));

  res.json(appointments);
}

async function handleGetAppointmentsList(req, res) {
  const userId = req.user.id;

  const appointmentsList = await Appointments.findAll({
    attributes: [
      "id",
      "appointmentDate",
      "service",
      "dateApproved",
      "appointmentStatus",
    ],
    where: {
      userId,
      dateApproved: { [Op.ne]: "CANCELLED" },
    },
    raw: true,
  });

  if (!appointmentsList) return res.status(404).json([]);

  res.json(appointmentsList);
}

async function handleBookAppointment(req, res) {
  const {
    userId,
    petNames,
    service,
    gender,
    concern,
    contactNumber,
    email,
    appointmentDate,
    veterinarian,
  } = req.body;

  let existingPetRecord = await Pets.findOne({
    attributes: ["id"],
    where: { name: petNames, userId },
  });

  const hasExistingPetRecord = existingPetRecord?.id;

  if (!existingPetRecord) {
    existingPetRecord = await Pets.create({
      userId,
      name: petNames,
      gender,
    });
  }

  try {
    await Appointments.create({
      userId,
      petNames,
      service,
      gender,
      concern,
      contactNumber,
      email,
      appointmentDate,
      veterinarian,
      dateApproved: "Pending",
      appointmentStatus: "PENDING",
      petId: existingPetRecord.id,
    });

    const message = `
    You have one new <span class="font-bold text-blue-500"><strong>${service}</strong></span> 
    appointment at <span class="font-bold text-gray-600"><strong>${dayjs(
      appointmentDate
    ).format("MMMM DD, YYYY hh:mm A")}</strong></span> 
    from <strong>${req.user.fullName}</strong>`;

    await Notifications.create({
      message,
      dateAndTime: appointmentDate,
      type: "admin",
    });

    return res.status(201).json({
      message: "Appointment created",
      hasExistingPetRecord: hasExistingPetRecord ? true : false,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while booking the appointment." });
  }
}

async function handleCancelAppointment(req, res) {
  const { appointmentId, dateAndTime, service } = req.body;

  await Appointments.update(
    {
      dateApproved: "CANCELLED",
      appointmentStatus: "CANCELLED",
      medicalRecordStatus: "NO RECORD",
      treatmentDateDone: "CANCELLED",
    },
    { where: { id: appointmentId } }
  );

  const message = `<strong>${req.user.fullName}</strong> has 
  <span style="color: red"><strong>cancelled</strong></span> their 
  <span class="font-bold text-blue-500"><strong>${service}</strong></span> appointment 
  at ${dateAndTime}.`;

  await Notifications.create({
    message,
    type: "admin",
  });

  res.status(200).json({ message: "Appointment cancelled" });
}

async function handleRescheduleAppointment(req, res) {
  const { appointmentId, newDate } = req.body;

  await Appointments.update(
    {
      appointmentDate: newDate,
      dateApproved: "Pending",
      appointmentStatus: "PENDING",
    },
    { where: { id: appointmentId } }
  );

  res.status(200).json({ message: "Appointment rescheduled" });
}

async function handleCheckAvailability(req, res) {
  const { appointmentDate, veterinarian } = req.body;

  const isAppointmentConflict = await Appointments.findOne({
    where: {
      appointmentDate,
      veterinarian,
    },
  });

  if (isAppointmentConflict) {
    res.status(400).json({
      message:
        "Appoinment date and/or veterinarian is in conflict with another appointment",
    });
    return;
  }

  return res.status(200).json({ message: "Appointment available" });
}

export {
  handleAppointment,
  handleGetAppointmentsCalendar,
  handleGetAppointmentsList,
  handleBookAppointment,
  handleCancelAppointment,
  handleRescheduleAppointment,
  handleCheckAvailability,
};
