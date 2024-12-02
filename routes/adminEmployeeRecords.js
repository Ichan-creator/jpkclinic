import express from "express";
import {
  handleAdminEmployeeRecords,
  handleGetAdminEmployeesList,
  handlePostAddRecord,
  handlePostEditRecord,
  handlePostDeleteRecord,
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
adminEmployeeRecordsRouter.post("/edit-record", handlePostEditRecord);
adminEmployeeRecordsRouter.post("/delete-record", handlePostDeleteRecord);

export default adminEmployeeRecordsRouter;
