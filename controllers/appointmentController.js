import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import { Op } from "sequelize";
import {
  AppointmentPets,
  Appointments,
  Notifications,
  Pets,
  Services,
} from "../models/index.models.js";

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

  const services = await Services.findAll({ raw: true });

  res.render("appointment", {
    ...userDetails,
    userPets,
    notifications: formattedNotifications,
    services,
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
    where: {
      userId,
      dateApproved: { [Op.ne]: "CANCELLED" },
    },
    include: [
      {
        model: Pets,
        through: { attributes: [] },
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  if (!appointmentsList) return res.status(404).json([]);

  res.json(appointmentsList);
}

async function handleBookAppointment(req, res) {
  const {
    userId,
    petNames,
    service,
    concern,
    contactNumber,
    email,
    appointmentDate,
    veterinarian,
  } = req.body;

  try {
    const pets = await Pets.findAll({
      where: {
        userId,
        name: petNames,
      },
    });

    if (pets.length !== petNames.length) {
      return res.status(404).json({
        message: "One or more pets not found for the specified user.",
      });
    }

    const appointment = await Appointments.create({
      userId,
      service,
      concern,
      contactNumber,
      email,
      appointmentDate,
      veterinarian,
      dateApproved: "Pending",
      appointmentStatus: "PENDING",
    });

    const appointmentPetsData = pets.map((pet) => ({
      appointmentId: appointment.id,
      petId: pet.id,
      petWeight: null,
      against: null,
      manufacturer: null,
      serialLotNumber: null,
      expiredDate: null,
      treatmentDateDone: null,
    }));

    await AppointmentPets.bulkCreate(appointmentPetsData);

    const message = `
    You have one new <span class="font-bold text-blue-500">${service}</span> 
    appointment on <span class="font-bold text-gray-600">${dayjs(
      appointmentDate
    ).format("MMMM DD, YYYY hh:mm A")}</span> 
    from <strong>${req.user.fullName}</strong>`;

    await Notifications.create({
      message,
      dateAndTime: appointmentDate,
      type: "admin",
    });

    return res.status(201).json({
      message: "Appointment booked successfully.",
      appointment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while booking the appointment.",
      error: error.message,
    });
  }
}

async function handleCancelAppointment(req, res) {
  const { appointmentId, dateAndTime, service, noteInput } = req.body;

  await Appointments.update(
    {
      dateApproved: "CANCELLED",
      appointmentStatus: "CANCELLED",
      medicalRecordStatus: "NO RECORD",
      treatmentDateDone: "CANCELLED",
      note: noteInput,
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
  const { appointmentId, newDate, service } = req.body;

  const message = `${req.user.fullName} has <strong>rescheduled</strong> their 
  <span class="font-bold text-blue-500">${service}</span> to 
  <span class="font-bold text-gray-600">${newDate}</span>.`;

  await Notifications.create({ message, type: "admin" });

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
  const userId = req.user.id;

  try {
    const appointmentConflict = await Appointments.findOne({
      where: {
        appointmentDate: appointmentDate,
        veterinarian: veterinarian,
        userId: {
          [Op.ne]: userId,
        },
      },
    });

    if (appointmentConflict) {
      return res.status(409).json({
        message:
          "Appoinment date and/or veterinarian is in conflict with another appointment",
      });
    } else {
      return res.status(200).json({ message: "Appointment is available." });
    }
  } catch (error) {
    console.error("Error checking appointment availability:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while checking availability." });
  }
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
