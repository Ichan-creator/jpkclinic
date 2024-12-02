import express from "express";
import {
  handleAdminAppointment,
  handleApproveAppointment,
  handleGetAdminAppointmentsCalendar,
  handleGetAdminAppointmentsList,
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

export default adminAppointmentRouter;
