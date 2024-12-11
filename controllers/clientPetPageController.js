import dayjs from "dayjs";
import { Appointments, Pets } from "../models/index.models.js";
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
    attributes: [
      "id",
      "appointmentDate",
      "service",
      "treatmentDateDone",
      "medicalRecordStatus",
    ],
    include: [
      {
        model: Pets,
        where: { id: petId },
        required: true,
      },
    ],
    where: { appointmentStatus: { [Op.ne]: "CANCELLED" } },
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

async function handleGetClientPetRecord(req, res) {
  const appointmentId = req.params.appointmentId;

  const petRecord = await Appointments.findOne({
    attributes: [
      "appointmentDate",
      "service",
      "treatmentDateDone",
      "petWeight",
      "against",
      "manufacturer",
      "serialLotNumber",
      "expiredDate",
      "treatmentDateDone",
      "veterinarian",
    ],
    where: { id: appointmentId },
    raw: true,
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

export {
  handleOwnedPets,
  handleGetOwnedPet,
  handleGetVisitationHistory,
  handleGetClientPetRecord,
  handleEditPetProfile,
};
