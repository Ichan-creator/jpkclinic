import express from "express";

import handleClinicDirectory from "../controllers/clinicDirectoryController.js";
import isClient from "../middlewares/isClient.js";

const clinicDirectoryRouter = express.Router();

clinicDirectoryRouter.get("/clinic-directory", isClient, handleClinicDirectory);

export default clinicDirectoryRouter;
