import express from "express";

import {
  handleAppointment,
  handleGetAppointmentsCalendar,
  handleGetAppointmentsList,
  handleBookAppointment,
  handleCancelAppointment,
  handleRescheduleAppointment,
} from "../controllers/appointmentController.js";
import isClient from "../middlewares/isClient.js";
import isAuthenticated from "../utils/isAuthenticated.js";

const appointmentRouter = express.Router();

appointmentRouter.use(isAuthenticated);

appointmentRouter.get("/appointment", isClient, handleAppointment);
appointmentRouter.get(
  "/appointments-calendar",
  isClient,
  handleGetAppointmentsCalendar
);
appointmentRouter.get(
  "/appointments-list",
  isClient,
  handleGetAppointmentsList
);
appointmentRouter.post("/book-appointment", isClient, handleBookAppointment);
appointmentRouter.post(
  "/cancel-appointment",
  isClient,
  handleCancelAppointment
);
appointmentRouter.post(
  "/reschedule-appointment",
  isClient,
  handleRescheduleAppointment
);

export default appointmentRouter;
