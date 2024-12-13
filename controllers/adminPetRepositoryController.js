import dayjs from "dayjs";
import {
  AppointmentPets,
  Appointments,
  Notifications,
  Pets,
  User,
} from "../models/index.models.js";
import { Op, where } from "sequelize";

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
  const petId = req.params.petId;

  const petRecord = await AppointmentPets.findOne({
    where: {
      petId,
      appointmentId,
    },
    attributes: [
      "petWeight",
      "against",
      "manufacturer",
      "serialLotNumber",
      "expiredDate",
      "treatmentDateDone",
    ],
    include: [
      {
        model: Appointments,
        attributes: ["id", "appointmentDate", "service", "veterinarian"],
      },
    ],
  });

  res.json(petRecord);
}

async function handleGetAdminVisitationHistory(req, res) {
  const petId = req.params.petId;

  const petVisitationHistory = await Appointments.findAll({
    attributes: ["id", "appointmentDate", "service", "medicalRecordStatus"],
    include: [
      {
        model: Pets,
        where: { id: petId },
      },
      {
        model: Pets,
        through: {
          model: AppointmentPets,
          attributes: ["treatmentDateDone"],
        },
      },
      {
        model: User,
        attributes: ["id"],
      },
    ],
    where: { appointmentStatus: { [Op.ne]: "CANCELLED" } },
  });

  res.json(petVisitationHistory);
}

async function handlePostAdminUpdatePetRecord(req, res) {
  const {
    appointmentId,
    petId,
    userId,
    treatmentDate,
    service,
    petWeight,
    against,
    manufacturer,
    serialLotNumber,
    expiredDate,
    treatmentDateDone,
  } = req.body;

  const message = `The status of your
  <span class="font-bold text-blue-500"><strong>${service}</strong></span> appointment
  on <span class="font-bold text-gray-600"><strong>${treatmentDate}</strong></span>
  is now <span style="color: green"><strong>COMPLETED</strong></span>.`;

  await Notifications.create({ message, userId });

  await Appointments.update(
    { medicalRecordStatus: "COMPLETE" },
    {
      where: { id: appointmentId },
    }
  );

  await AppointmentPets.update(
    {
      petWeight,
      against,
      manufacturer,
      serialLotNumber,
      expiredDate,
      treatmentDateDone,
    },
    {
      where: {
        appointmentId,
        petId,
      },
    }
  );

  res.json({ message: "Successfull update pet record" });
}

async function handlePostAdminUpdatePetStatus(req, res) {
  const { appointmentId, newPetStatus, treatmentDate, userId, service } =
    req.body;

  await Appointments.update(
    { medicalRecordStatus: newPetStatus },
    { where: { id: appointmentId } }
  );

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
