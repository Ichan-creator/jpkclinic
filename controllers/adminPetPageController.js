import dayjs from "dayjs";
import { Appointments, Pets } from "../models/index.models.js";

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
  const petName = req.params.name;

  const petVisitationHistory = await Appointments.findAll({
    attributes: ["appointmentDate", "service", "dateApproved"],
    where: { petNames: petName },
    raw: true,
  });

  const newPetVisitationHistory = petVisitationHistory.map((item) => {
    return {
      ...item,
      appointmentDate: dayjs(item.appointmentDate).format(
        "MMMM DD, YYYY hh:mm A"
      ),
    };
  });

  res.json(newPetVisitationHistory);
}

export {
  handleGetAdminOwnedPet,
  handleGetClientOwnedPets,
  handleGetAdminVisitationHistory,
};
