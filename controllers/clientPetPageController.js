import dayjs from "dayjs";
import { AppointmentPets, Appointments, Pets } from "../models/index.models.js";
import { Op } from "sequelize";

async function handleOwnedPets(req, res) {
  const userId = req.user.id;

  const ownedPets = await Pets.findAll({ where: { userId }, raw: true });

  res.status(200).json(ownedPets);
}

async function handleGetOwnedPet(req, res) {
  const petId = req.params.id;

  const petDetails = await Pets.findOne({ where: { id: petId }, raw: true });

  const formattedAccountCreationDate = dayjs(petDetails.createdAt).format(
    "MMMM D, YYYY h:mm A"
  );

  res.render("clientPetPage", {
    ...petDetails,
    createdAt: formattedAccountCreationDate,
    dayjs,
  });
}

async function handleGetVisitationHistory(req, res) {
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
    ],
    where: { appointmentStatus: { [Op.ne]: "CANCELLED" } },
  });

  res.json(petVisitationHistory);
}

async function handleGetClientPetRecord(req, res) {
  const appointmentId = req.params.appointmentId;
  const petId = req.params.petId;

  const petRecord = await AppointmentPets.findOne({
    where: {
      appointmentId,
      petId,
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

async function handleEditPetProfile(req, res) {
  const { petId, petBirthdate, animalType, petBreed, petGender } = req.body;

  await Pets.update(
    {
      birthday: petBirthdate,
      animalType,
      breed: petBreed,
      gender: petGender,
    },
    { where: { id: petId } }
  );

  res.status(200).json({ message: "Pet profile updated" });
}

async function handlePrintRecord(req, res) {
  const {
    treatmentDate,
    appointmentDate,
    service,
    treatmentDateDone,
    petWeight,
    against,
    manufacturer,
    serialLotNumber,
    expiredDate,
    veterinarian,
  } = req.body;
}

export {
  handleOwnedPets,
  handleGetOwnedPet,
  handleGetVisitationHistory,
  handleGetClientPetRecord,
  handleEditPetProfile,
};
