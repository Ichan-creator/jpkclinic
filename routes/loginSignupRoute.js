import express from "express";

import {
  handleGetWelcome,
  handleContactUs,
  handleGetServices,
  handleGetLoginSignup,
  handleGetForgotPassword,
  handleGetForgotPasswordToken,
  handlePostForgotPassword,
  handleLogout,
  handlePostLogin,
  handleSignup,
  handleVerifyAccount,
  handleResendLink,
  handleReadAllNotifications,
  handleIsExistingUser,
  handlePostResetPassword,
} from "../controllers/loginSignupController.js";

const loginSignupRouter = express.Router();

loginSignupRouter.get("/welcome", handleGetWelcome);
loginSignupRouter.get("/contact", handleContactUs);
loginSignupRouter.get("/services", handleGetServices);
loginSignupRouter.get("/login", handleGetLoginSignup);
loginSignupRouter.get("/forgot-password", handleGetForgotPassword);
loginSignupRouter.get(
  "/forgot-password/:resetToken",
  handleGetForgotPasswordToken
);
loginSignupRouter.post("/reset-password", handlePostResetPassword);
loginSignupRouter.post("/forgot-password", handlePostForgotPassword);
loginSignupRouter.get("/verify/:verifyAccountToken", handleVerifyAccount);
loginSignupRouter.post("/resend-link", handleResendLink);
loginSignupRouter.post("/login", handlePostLogin);
loginSignupRouter.post("/signup", handleSignup);
loginSignupRouter.post("/existing-user", handleIsExistingUser);
loginSignupRouter.post("/read-all-notifications", handleReadAllNotifications);
loginSignupRouter.post("/logout", handleLogout);

export default loginSignupRouter;
