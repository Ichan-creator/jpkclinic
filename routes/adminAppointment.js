import express from "express";
import {
  handleAdminAppointment,
  handleApproveAppointment,
  handleGetAdminAppointmentsCalendar,
  handleGetAdminPendingAppointmentsList,
  handleGetAdminApprovedAppointmentsList,
} from "../controllers/adminAppointmentController.js";

const adminAppointmentRouter = express.Router();

adminAppointmentRouter.get("/admin-appointment", handleAdminAppointment);
adminAppointmentRouter.get(
  "/admin-appointments-calendar",
  handleGetAdminAppointmentsCalendar
);
adminAppointmentRouter.get(
  "/admin-pending-appointment-list",
  handleGetAdminPendingAppointmentsList
);
adminAppointmentRouter.get(
  "/admin-approved-appointment-list",
  handleGetAdminApprovedAppointmentsList
);
adminAppointmentRouter.post("/approve-appointment", handleApproveAppointment);

export default adminAppointmentRouter;
