import { Op } from "sequelize";
import { Appointments, Pets, User } from "../models/index.models.js";

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

  res.render("adminNav", {
    pendingAppointments,
    confirmedAppointments,
    cancelledAppointments,
  });
}

async function handleGetAdminAppointmentRequests(req, res) {
  const appointmentRequests = await Appointments.findAll({
    attributes: ["id", "veterinarian", "appointmentStatus", "appointmentDate"],
    include: {
      model: Pets,
      attributes: ["name", "animalType"],
      include: { model: User, attributes: ["fullName"] },
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
  const { appointmentId } = req.body;

  await Appointments.update(
    { dateApproved: "cancelled", appointmentStatus: "CANCELLED" },
    { where: { id: appointmentId } }
  );

  res.status(200).json({ message: "Appointment cancelled" });
}

export {
  handleAdminNav,
  handleGetAdminAppointmentRequests,
  handleGetAdminMedicalRecords,
  handleCancelAppointment,
};
