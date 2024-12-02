import express from "express";
import {
  handleAdminNav,
  handleCancelAppointment,
  handleGetAdminAppointmentRequests,
  handleGetAdminMedicalRecords,
} from "../controllers/adminNavController.js";

const adminNavRouter = express.Router();

adminNavRouter.get("/admin", handleAdminNav);
adminNavRouter.get(
  "/admin-appointment-requests",
  handleGetAdminAppointmentRequests
);
adminNavRouter.get("/admin-medical-records", handleGetAdminMedicalRecords);
adminNavRouter.post("/admin-cancel-appointment", handleCancelAppointment);

export default adminNavRouter;
