import express from "express";
import {
  handleGetClientAppointmentHistory,
  handleGetClientAppointmentHistoryList,
} from "../controllers/clientAppointmentHistoryController.js";

const clientAppointmentHistory = express.Router();

clientAppointmentHistory.get(
  "/appointment-history",
  handleGetClientAppointmentHistory
);
clientAppointmentHistory.get(
  "/appointments-history-list",
  handleGetClientAppointmentHistoryList
);

export default clientAppointmentHistory;
