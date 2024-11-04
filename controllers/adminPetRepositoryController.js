import dayjs from "dayjs";
import { Appointments, Pets, User } from "../models/index.models.js";

function handleAdminPetRepository(req, res) {
  res.render("adminPetRepository");
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
    ],
    where: { petId },
    raw: true,
  });

  const newPetVisitationHistory = petVisitationHistory.map((item) => {
    return {
      ...item,
      appointmentDate: dayjs(item.appointmentDate).format(
        "MMMM DD, YYYY hh:mm A"
      ),
      treatmentDateDone: item.treatmentDateDone
        ? dayjs(item.treatmentDateDone).format("MMMM DD, YYYY")
        : "",
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
  } = req.body;

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
    },
    { where: { id: appointmentId } }
  );

  res.json({ message: "Successfull update pet record" });
}

async function handlePostAdminUpdatePetStatus(req, res) {
  const { appointmentId, newPetStatus } = req.body;

  await Appointments.update(
    { medicalRecordStatus: newPetStatus },
    { where: { id: appointmentId } }
  );

  res.json({ message: "Successfully update new pet status" });
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
