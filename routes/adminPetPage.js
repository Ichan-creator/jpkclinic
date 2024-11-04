import express from "express";
import {
  handleGetAdminOwnedPet,
  handleGetAdminVisitationHistory,
  handleGetClientOwnedPets,
} from "../controllers/adminPetPageController.js";

const adminPetPageRouter = express.Router();

adminPetPageRouter.get("/admin-owned-pets/:id", handleGetAdminOwnedPet);
adminPetPageRouter.get(
  "/admin-client-owned-pets/:id",
  handleGetClientOwnedPets
);
adminPetPageRouter.get(
  "/admin-visitation-history/:name",
  handleGetAdminVisitationHistory
);

export default adminPetPageRouter;
