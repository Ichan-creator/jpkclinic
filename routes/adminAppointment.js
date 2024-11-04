import express from "express";
import {
  handleAdminAppointment,
  handleApproveAppointment,
  handleGetAdminAppointmentsCalendar,
  handleGetAdminAppointmentsList,
  handleRejectAppointment,
} from "../controllers/adminAppointmentController.js";

const adminAppointmentRouter = express.Router();

adminAppointmentRouter.get("/admin-appointment", handleAdminAppointment);
adminAppointmentRouter.get(
  "/admin-appointments-calendar",
  handleGetAdminAppointmentsCalendar
);
adminAppointmentRouter.get(
  "/admin-appointment-list",
  handleGetAdminAppointmentsList
);
adminAppointmentRouter.post("/approve-appointment", handleApproveAppointment);
adminAppointmentRouter.post("/reject-appointment", handleRejectAppointment);

export default adminAppointmentRouter;
