import express from "express";

import handleClientNav from "../controllers/clientNavController.js";
import isClient from "../middlewares/isClient.js";
import isAuthenticated from "../utils/isAuthenticated.js";

const clientNavRouter = express.Router();

clientNavRouter.use(isAuthenticated);

clientNavRouter.get("/", isClient, handleClientNav);

export default clientNavRouter;
