import express from "express";

import {
  handleOwnedPets,
  handleGetOwnedPet,
  handleGetVisitationHistory,
  handleGetClientPetRecord,
  handleEditPetProfile,
} from "../controllers/clientPetPageController.js";
import isClient from "../middlewares/isClient.js";

const clientPetPageRouter = express.Router();

clientPetPageRouter.get("/owned-pets", isClient, handleOwnedPets);
clientPetPageRouter.get("/owned-pets/:id", isClient, handleGetOwnedPet);
clientPetPageRouter.get(
  "/visitation-history/:name",
  isClient,
  handleGetVisitationHistory
);
clientPetPageRouter.get("/pet-record/:appointmentId", handleGetClientPetRecord);
clientPetPageRouter.post("/edit-pet-profile", isClient, handleEditPetProfile);

export default clientPetPageRouter;
