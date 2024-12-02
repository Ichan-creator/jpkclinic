import express from "express";
import {
  handleAdminEmployeeRecords,
  handleGetAdminEmployeesList,
  handlePostAddRecord,
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
adminEmployeeRecordsRouter.post("/add-record", handlePostAddRecord);

export default adminEmployeeRecordsRouter;
