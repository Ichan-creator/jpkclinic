import express from "express";
import {
  handleAdminClientPage,
  handleAdminClientPersonalPage,
  handleAdminClientList,
  handleAdminEditClientProfile,
} from "../controllers/adminClientPageController.js";

const adminClientPageRouter = express.Router();

adminClientPageRouter.get("/admin-client-page", handleAdminClientPage);
adminClientPageRouter.get(
  "/admin-client-personal-page/:id",
  handleAdminClientPersonalPage
);
adminClientPageRouter.get("/admin-client-list", handleAdminClientList);
adminClientPageRouter.post(
  "/admin-edit-client-profile",
  handleAdminEditClientProfile
);

export default adminClientPageRouter;
