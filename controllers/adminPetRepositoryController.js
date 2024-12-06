import dayjs from "dayjs";
import {
  Appointments,
  Notifications,
  Pets,
  User,
} from "../models/index.models.js";
import { Op } from "sequelize";
import sendStatusUpdate from "../utils/sendStatusUpdate.js";

async function handleAdminPetRepository(req, res) {
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

  res.render("adminPetRepository", {
    notifications: formattedNotifications,
    adminName: req.user.fullName,
  });
}

async function handleGetAdminPetsList(req, res) {
  const petsList = await Pets.findAll({
    attributes: ["id", "name", "animalType", "breed"],
    include: {
      model: User,
      attributes: ["fullName"],
    },
    raw: true,
  });

  res.status(200).json(petsList);
}

async function handleGetAdminPetRepositoryRecord(req, res) {
  const petId = req.params.id;

  const petDetails = await Pets.findOne({
    where: { id: petId },
    raw: true,
  });

  let formattedBirthday = null;

  if (petDetails.birthday) {
    formattedBirthday = dayjs(petDetails.birthday).format("MMMM DD, YYYY");
  }

  const formattedAccountCreationDate = dayjs(petDetails.createdAt).format(
    "MMMM DD, YYYY h:mm A"
  );

  res.render("adminPetRepositoryRecord", {
    ...petDetails,
    birthday: formattedBirthday || "",
    createdAt: formattedAccountCreationDate,
  });
}

async function handleGetAdminPetRecord(req, res) {
  const appointmentId = req.params.appointmentId;

  const petRecord = await Appointments.findOne({
    attributes: [
      "appointmentDate",
      "service",
      "treatmentDateDone",
      "petWeight",
      "temperature",
      "ppm",
      "cbc",
      "urinalysisResult",
      "respiratoryRate",
      "observation",
      "prescription",
    ],
    where: { id: appointmentId },
    raw: true,
  });

  res.json(petRecord);
}

async function handleGetAdminVisitationHistory(req, res) {
  const petId = req.params.petId;

  const petVisitationHistory = await Appointments.findAll({
    attributes: [
      "id",
      "appointmentDate",
      "service",
      "treatmentDateDone",
      "medicalRecordStatus",
      "userId",
    ],
    where: { petId, dateApproved: { [Op.ne]: "PENDING" } },
    raw: true,
  });

  const newPetVisitationHistory = petVisitationHistory.map((item) => {
    return {
      ...item,
      appointmentDate: dayjs(item.appointmentDate).format(
        "MMMM DD, YYYY hh:mm A"
      ),
      treatmentDateDone:
        item.treatmentDateDone && item.treatmentDateDone !== "CANCELLED"
          ? dayjs(item.treatmentDateDone).format("MMMM DD, YYYY")
          : item.treatmentDateDone,
    };
  });

  res.json(newPetVisitationHistory);
}

async function handlePostAdminUpdatePetRecord(req, res) {
  const {
    appointmentId,
    treatmentDateDone,
    petWeight,
    temperature,
    ppm,
    cbc,
    urinalysisResult,
    respiratoryRate,
    observation,
    prescription,
    userId,
    service,
    treatmentDate,
  } = req.body;

  const message = `The status of your
  <span class="font-bold text-blue-500"><strong>${service}</strong></span> appointment
  on <span class="font-bold text-gray-600"><strong>${treatmentDate}</strong></span>
  is now <span style="color: green"><strong>COMPLETED</strong></span>.`;

  sendStatusUpdate(message, userId, "COMPLETE");

  await Notifications.create({ message, userId });

  await Appointments.update(
    {
      treatmentDateDone,
      petWeight,
      temperature,
      ppm,
      cbc,
      urinalysisResult,
      respiratoryRate,
      observation,
      prescription,
      medicalRecordStatus: "COMPLETE",
    },
    { where: { id: appointmentId } }
  );

  res.json({ message: "Successfull update pet record" });
}

async function handlePostAdminUpdatePetStatus(req, res) {
  const { appointmentId, newPetStatus, treatmentDate, userId, service } =
    req.body;

  const message = `The status of your
  <span class="font-bold text-blue-500"><strong>${service}</strong></span> appointment
  on <span class="font-bold text-gray-600"><strong>${treatmentDate}</strong></span>
  is now <span style="color: yellow"><strong>${newPetStatus}</strong></span>.`;

  sendStatusUpdate(message, userId, newPetStatus);

  await Appointments.update(
    { medicalRecordStatus: newPetStatus },
    { where: { id: appointmentId } }
  );

  await Notifications.create({ message, userId });

  res.json({ message: "Successfully updated new pet status" });
}

export {
  handleAdminPetRepository,
  handleGetAdminPetsList,
  handleGetAdminPetRepositoryRecord,
  handleGetAdminPetRecord,
  handleGetAdminVisitationHistory,
  handlePostAdminUpdatePetRecord,
  handlePostAdminUpdatePetStatus,
};
