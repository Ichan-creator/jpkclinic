import express from "express";
import {
  handleAdminNav,
  handleGetAdminAppointmentRequests,
  handleGetAdminMedicalRecords,
  handleGetAdminServices,
  handleCancelAppointment,
  handlePostAddAdminService,
  handlePostDeleteAdminService,
} from "../controllers/adminNavController.js";

const adminNavRouter = express.Router();

adminNavRouter.get("/admin", handleAdminNav);
adminNavRouter.get(
  "/admin-appointment-requests",
  handleGetAdminAppointmentRequests
);
adminNavRouter.get("/admin-medical-records", handleGetAdminMedicalRecords);
adminNavRouter.get("/admin-services", handleGetAdminServices);
adminNavRouter.post("/add-service", handlePostAddAdminService);
adminNavRouter.post("/delete-service", handlePostDeleteAdminService);
adminNavRouter.post("/admin-cancel-appointment", handleCancelAppointment);

export default adminNavRouter;
