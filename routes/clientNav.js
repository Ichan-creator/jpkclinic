import express from "express";

import handleClientNav from "../controllers/clientNavController.js";
import isClient from "../middlewares/isClient.js";

const clientNavRouter = express.Router();

clientNavRouter.get("/", isClient, handleClientNav);

export default clientNavRouter;
