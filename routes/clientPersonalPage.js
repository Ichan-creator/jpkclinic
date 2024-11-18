import express from "express";
import { fileURLToPath } from "url";
import multer from "multer";
import path from "path";
import { User } from "../models/index.models.js";

import {
  handlePersonalPage,
  handlePetPage,
  handleEditProfile,
  handleIsProfileComplete,
  handleUpdateIsFirstTimeLogin,
} from "../controllers/personalPageController.js";
import isClient from "../middlewares/isClient.js";
import isAuthenticated from "../utils/isAuthenticated.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const personalPageRouter = express.Router();

personalPageRouter.use(isAuthenticated);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads/"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

personalPageRouter.get("/personal-page", isClient, handlePersonalPage);
personalPageRouter.get("/pet-page", isClient, handlePetPage);
personalPageRouter.post("/edit-profile", isClient, handleEditProfile);
personalPageRouter.get(
  "/is-profile-complete",
  isClient,
  handleIsProfileComplete
);
personalPageRouter.post(
  "/update-is-first-time-login",
  handleUpdateIsFirstTimeLogin
);
personalPageRouter.post(
  "/upload",
  upload.single("profilePicture"),
  async (req, res) => {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    try {
      await User.update({ avatar: imageUrl }, { where: { id: req.user.id } });
      res.json({ success: true, imageUrl });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Database error", error });
    }
  }
);

export default personalPageRouter;
