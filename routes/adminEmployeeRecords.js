import express from "express";
import {
  handleAdminEmployeeRecords,
  handleGetAdminEmployeesList,
} from "../controllers/adminEmployeeRecords.js";

const adminEmployeeRecordsRouter = express.Router();

adminEmployeeRecordsRouter.get(
  "/admin-employee-records",
  handleAdminEmployeeRecords
);
adminEmployeeRecordsRouter.get(
  "/admin-employees-list",
  handleGetAdminEmployeesList
);

export default adminEmployeeRecordsRouter;
