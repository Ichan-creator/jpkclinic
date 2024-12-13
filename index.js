import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import flash from "connect-flash";
import { fileURLToPath } from "url";
import MySQLSessionStore from "./middlewares/session.js";
import passport from "./config/passport.js";
import path from "path";
import session from "express-session";

import {
  AppointmentPets,
  Appointments,
  initDB,
  Pets,
  User,
} from "./models/index.models.js";
import noCache from "./middlewares/noCache.js";

import loginSignupRouter from "./routes/loginSignupRoute.js";
import clientNavRouter from "./routes/clientNav.js";
import appointmentRouter from "./routes/clientAppointment.js";
import clientPetPageRouter from "./routes/clientPetPage.js";
import clinicDirectoryRouter from "./routes/clientClinicDirectory.js";
import personalPageRouter from "./routes/clientPersonalPage.js";
import clientAppointmentHistory from "./routes/clientAppointmentHistory.js";
import adminLoginRouter from "./routes/adminLogin.js";
import adminNavRouter from "./routes/adminNav.js";
import adminAppointmentRouter from "./routes/adminAppointment.js";
import adminClientPageRouter from "./routes/adminClientPage.js";
import adminPetPageRouter from "./routes/adminPetPage.js";
import adminPetRepositoryRouter from "./routes/adminPetRepository.js";
import adminEmployeeRecordsRouter from "./routes/adminEmployeeRecords.js";
import adminHistoryRouter from "./routes/adminHistory.js";
import hashPassword from "./utils/hashPassword.js";
import isAdmin from "./middlewares/isAdmin.js";
import { Op } from "sequelize";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;

const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public")));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "ambatukam",
    resave: false,
    saveUninitialized: false,
    store: MySQLSessionStore,
    cookie: { httpOnly: true, sameSite: "strict", maxAge: 60 * 60 * 1000 },
  })
);

app.use(flash());
app.use(noCache);

app.use(passport.initialize());
app.use(passport.session());

app.get("/try", async (req, res) => {
  const hashedPassword = await hashPassword("password");

  await User.create({
    name: "admin",
    password: hashedPassword,
    role: "admin",
  });

  res.json({ message: "Done" });
});

app.use(adminLoginRouter);
app.use(loginSignupRouter);

// Client pages
app.use(clientNavRouter);
app.use(appointmentRouter);
app.use(clientPetPageRouter);
app.use(personalPageRouter);
app.use(clinicDirectoryRouter);
app.use(clientAppointmentHistory);

// Admin pages
app.use(isAdmin);

app.use(adminNavRouter);
app.use(adminAppointmentRouter);
app.use(adminClientPageRouter);
app.use(adminPetPageRouter);
app.use(adminPetRepositoryRouter);
app.use(adminEmployeeRecordsRouter);
app.use(adminHistoryRouter);

// initDB().then(() => {
//   app.listen(PORT, () => {
//     console.log(`App running on port ${PORT}.`);
//   });
// });

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening on port ${PORT}`);
});
