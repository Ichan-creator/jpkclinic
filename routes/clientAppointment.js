import express from "express";

import {
  handleAppointment,
  handleGetAppointmentsCalendar,
  handleGetAppointmentsList,
  handleBookAppointment,
  handleCancelAppointment,
} from "../controllers/appointmentController.js";
import isClient from "../middlewares/isClient.js";

const appointmentRouter = express.Router();

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

export default appointmentRouter;
