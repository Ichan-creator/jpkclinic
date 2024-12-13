import dayjs from "dayjs";
import { AppointmentPets, Appointments, Pets } from "../models/index.models.js";
import { Op } from "sequelize";

async function handleGetClientOwnedPets(req, res) {
  const userId = req.params.id;

  const ownedPets = await Pets.findAll({ where: { userId }, raw: true });

  res.status(200).json(ownedPets);
}

async function handleGetAdminOwnedPet(req, res) {
  try {
    const petId = req.params.id;

    const petDetails = await Pets.findOne({ where: { id: petId }, raw: true });

    if (!petDetails) {
      return res.status(404).send("Pet not found");
    }

    const formattedAccountCreationDate = dayjs(petDetails.createdAt).format(
      "MMMM D, YYYY h:mm A"
    );

    res.render("adminPetPage", {
      ...petDetails,
      createdAt: formattedAccountCreationDate,
      dayjs,
    });
  } catch (error) {
    console.error("Error in handleGetAdminOwnedPet:", error);
    res.status(500).send("Server error");
  }
}

async function handleGetAdminVisitationHistory(req, res) {
  const petId = req.params.petId;

  const petVisitationHistory = await Appointments.findAll({
    attributes: [
      "id",
      "appointmentDate",
      "service",
      "medicalRecordStatus",
      "dateApproved",
    ],
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

export {
  handleGetAdminOwnedPet,
  handleGetClientOwnedPets,
  handleGetAdminVisitationHistory,
};
