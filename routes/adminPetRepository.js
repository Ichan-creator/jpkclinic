import express from "express";
import {
  handleAdminPetRepository,
  handleGetAdminPetRecord,
  handleGetAdminPetRepositoryRecord,
  handleGetAdminPetsList,
  handleGetAdminVisitationHistory,
  handlePostAdminUpdatePetRecord,
  handlePostAdminUpdatePetStatus,
} from "../controllers/adminPetRepositoryController.js";

const adminPetRepositoryRouter = express.Router();

adminPetRepositoryRouter.get("/admin-pet-repository", handleAdminPetRepository);
adminPetRepositoryRouter.get("/admin-pets-list", handleGetAdminPetsList);
adminPetRepositoryRouter.get(
  "/admin-pet-repository/:id",
  handleGetAdminPetRepositoryRecord
);
adminPetRepositoryRouter.get(
  "/admin-pet-record/:appointmentId/:petId",
  handleGetAdminPetRecord
);
adminPetRepositoryRouter.get(
  "/admin-visitation-history-record/:petId",
  handleGetAdminVisitationHistory
);
adminPetRepositoryRouter.post(
  "/admin-update-pet-record",
  handlePostAdminUpdatePetRecord
);
adminPetRepositoryRouter.post(
  "/admin-update-pet-status",
  handlePostAdminUpdatePetStatus
);

export default adminPetRepositoryRouter;
