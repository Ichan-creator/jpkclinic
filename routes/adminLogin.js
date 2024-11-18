import express from "express";
import {
  handleGetAdminLogin,
  handlePostAdminLogin,
} from "../controllers/adminLoginController.js";

const adminLoginRouter = express.Router();

adminLoginRouter.get("/admin-login", handleGetAdminLogin);
adminLoginRouter.post("/admin-login", handlePostAdminLogin);

export default adminLoginRouter;
