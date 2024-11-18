import express from "express";

import handleClinicDirectory from "../controllers/clinicDirectoryController.js";
import isClient from "../middlewares/isClient.js";
import isAuthenticated from "../utils/isAuthenticated.js";

const clinicDirectoryRouter = express.Router();

clinicDirectoryRouter.use(isAuthenticated);

clinicDirectoryRouter.get("/clinic-directory", isClient, handleClinicDirectory);

export default clinicDirectoryRouter;
