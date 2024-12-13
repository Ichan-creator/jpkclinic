import express from "express";

import {
  handleOwnedPets,
  handleGetOwnedPet,
  handleGetVisitationHistory,
  handleGetClientPetRecord,
  handleEditPetProfile,
} from "../controllers/clientPetPageController.js";
import isClient from "../middlewares/isClient.js";
import isAuthenticated from "../utils/isAuthenticated.js";

const clientPetPageRouter = express.Router();

clientPetPageRouter.use(isAuthenticated);

clientPetPageRouter.get("/owned-pets", isClient, handleOwnedPets);
clientPetPageRouter.get("/owned-pets/:id", isClient, handleGetOwnedPet);
clientPetPageRouter.get(
  "/visitation-history/:petId",
  isClient,
  handleGetVisitationHistory
);
clientPetPageRouter.get(
  "/pet-record/:appointmentId/:petId",
  handleGetClientPetRecord
);
clientPetPageRouter.post("/edit-pet-profile", isClient, handleEditPetProfile);

export default clientPetPageRouter;
