import express from "express";
import {
  handleAdminAppointment,
  handleApproveAppointment,
  handleGetAdminAppointmentsCalendar,
  handleGetAdminPendingAppointmentsList,
  handleGetAdminPetRecordsList,
  handleGetAdminApprovedAppointmentsList,
  handleGetAdminCancelledAppointmentsList,
  handleGetAdminCompletedAppointmentsList,
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
  "/admin-pet-records-list",
  handleGetAdminPetRecordsList
);
adminAppointmentRouter.get(
  "/admin-approved-appointment-list",
  handleGetAdminApprovedAppointmentsList
);
adminAppointmentRouter.get(
  "/admin-cancelled-appointment-list",
  handleGetAdminCancelledAppointmentsList
);
adminAppointmentRouter.get(
  "/admin-completed-appointment-list",
  handleGetAdminCompletedAppointmentsList
);
adminAppointmentRouter.post("/approve-appointment", handleApproveAppointment);

export default adminAppointmentRouter;
