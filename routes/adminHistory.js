import express from "express";
import { handleGetAdminHistory } from "../controllers/adminHistoryController.js";

const adminHistoryRouter = express.Router();

adminHistoryRouter.get("/admin-history", handleGetAdminHistory);

export default adminHistoryRouter;
