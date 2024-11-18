import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import passport from "../config/passport.js";
import { Notifications, User } from "../models/index.models.js";
import { v4 as uuidv4 } from "uuid";
import hashPassword from "../utils/hashPassword.js";
import sendVerifyEmail from "../utils/sendVerifyLink.js";
import sendPasswordResetLink from "../utils/sendPasswordResetLink.js";

dotenv.config();

function handleGetWelcome(req, res) {
  res.render("landingPage");
}

function handleGetServices(req, res) {
  res.render("services");
}

function handleContactUs(req, res) {
  res.render("contactUs");
}

function handleGetLoginSignup(req, res) {
  res.render("loginSignup", {
    loginError: req.flash("error"),
    signUpError: req.flash("signUpError"),
    signUpSuccess: req.flash("success"),
  });
}

function handleGetForgotPassword(req, res) {
  res.render("forgotPasswordPage", { message: "" });
}

function handleGetForgotPasswordToken(req, res) {
  const { resetToken } = req.params;

  jwt.verify(
    resetToken,
    process.env.EMAIL_TOKEN_SECRET,
    async (error, decoded) => {
      if (error) {
        return res.status(403).redirect("/login");
      }

      const { id, iat } = decoded;

      const user = await User.findByPk(id, {
        attributes: ["updatedAt"],
        raw: true,
      });

      const tokenIssuedAt = new Date(iat * 1000);
      const userUpdatedAt = new Date(user.updatedAt);

      if (tokenIssuedAt < userUpdatedAt) {
        return res.status(403).redirect("/login");
      }

      res.render("passwordResetPage", { userId: id });
    }
  );
}

async function handlePostForgotPassword(req, res) {
  const { email } = req.body;

  const user = await User.findOne({ where: { email }, raw: true });

  if (user) {
    sendPasswordResetLink(user.id, user.email);
  }

  res.render("forgotPasswordPage", {
    message:
      "A password reset link was sent to your email if there is an account associated with it.",
  });
}

async function handlePostResetPassword(req, res) {
  const { userId, newPassword } = req.body;

  const hashedPassword = await hashPassword(newPassword);

  await User.update({ password: hashedPassword }, { where: { id: userId } });

  res.json({ message: "Password successfully changed" });
}

function handlePostLogin(req, res, next) {
  passport.authenticate("local", (error, user, info) => {
    if (error) return next(error);

    if (!user) {
      return res.status(401).json({ success: false, message: info.message });
    }

    if (user && !user.verified) {
      return res.status(401).json({
        success: true,
        isVerified: false,
        email: user.email,
        message: info.message,
      });
    }

    req.logIn(user, next);
  })(req, res, next);
}

async function handleSignup(req, res) {
  const { signUpUsername, signUpEmail, signUpPassword } = req.body;

  sendVerifyEmail(signUpEmail, process.env.EMAIL_TOKEN_SECRET);

  const hashedPassword = await hashPassword(signUpPassword);

  try {
    await User.create({
      id: uuidv4(),
      name: signUpUsername,
      password: hashedPassword,
      email: signUpEmail,
      role: "client",
      verified: false,
    });

    res.status(200).json({ message: "Signup success" });
  } catch (error) {
    console.error(error);
  }
}

function handleVerifyAccount(req, res) {
  const verifyAccountToken = req.params.verifyAccountToken;

  jwt.verify(
    verifyAccountToken,
    process.env.EMAIL_TOKEN_SECRET,
    async (error, decoded) => {
      let linkExpired = false;
      let verifySuccess = null;

      if (error) {
        linkExpired = true;
      } else {
        const { email, iat } = decoded;

        const user = await User.findOne({ where: { email }, raw: true });

        if (!user) {
          linkExpired = true;
        } else {
          const isVerified = Boolean(parseInt(user.verified));
          const tokenIssuedAt = new Date(iat * 1000);
          const userVerifiedAt = user.updatedAt
            ? new Date(user.updatedAt)
            : null;

          if (user && isVerified) {
            if (userVerifiedAt && tokenIssuedAt < userVerifiedAt) {
              linkExpired = true;
            } else {
              linkExpired = true;
            }
          } else {
            verifySuccess = true;
            await User.update({ verified: true }, { where: { email } });
          }
        }
      }

      return res.render("emailVerified", {
        linkExpired,
        verifySuccess,
      });
    }
  );
}

function handleResendLink(req, res) {
  const { email } = req.body;

  sendVerifyEmail(email, process.env.EMAIL_TOKEN_SECRET);

  res.json({ success: true, message: "Email sent" });
}

async function handleIsExistingUser(req, res) {
  const { name, email } = req.body;

  const identifier = name || email;

  const user = await User.findOne({
    where: name ? { name: identifier } : { email: identifier },
    raw: true,
  });

  if (user) {
    return res.json({ isExistingUser: true });
  } else {
    return res.json({ isExistingUser: false });
  }
}

async function handleReadAllNotifications(req, res) {
  await Notifications.update(
    { isRead: true },
    { where: { userId: req.user.id } }
  );

  res.json({ message: "Successfully read all notifications" });
}

function handleLogout(req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
}

export {
  handleGetWelcome,
  handleContactUs,
  handleGetServices,
  handleGetLoginSignup,
  handleGetForgotPassword,
  handleGetForgotPasswordToken,
  handlePostForgotPassword,
  handlePostResetPassword,
  handlePostLogin,
  handleSignup,
  handleVerifyAccount,
  handleResendLink,
  handleIsExistingUser,
  handleReadAllNotifications,
  handleLogout,
};
