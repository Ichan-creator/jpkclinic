import comparePassword from "../utils/comparePassword.js";
import dotenv from "dotenv";
import { Strategy } from "passport-local";
import passport from "passport";
import { User } from "../models/index.models.js";

dotenv.config();

passport.use(
  "local",
  new Strategy(
    { usernameField: "loginUsername", passwordField: "loginPassword" },
    async (loginUsername, loginPassword, done) => {
      try {
        const user = await User.findOne({
          where: { name: loginUsername },
          attributes: [
            "id",
            "name",
            "fullName",
            "birthday",
            "email",
            "contactNumber",
            "gender",
            "role",
            "isFirstTimeLogin",
            "isProfileComplete",
            "avatar",
            "verified",
            "password",
            "createdAt",
          ],
          raw: true,
        });

        if (!user) {
          return done(null, false, {
            message: "Incorrect username or password.",
          });
        }

        if (user.role === "admin") {
          return done(null, false, {
            message: "Incorrect username or password",
          });
        }

        const isPasswordMatch = await comparePassword(
          loginPassword,
          user.password
        );

        if (!isPasswordMatch) {
          return done(null, false, {
            message: "Incorrect username or password.",
          });
        }

        if (isPasswordMatch) {
          const isVerified = Boolean(parseInt(user.verified));

          if (!isVerified) {
            return done(
              null,
              { isVerified, email: user.email },
              {
                message: "Your account still needs verification.",
              }
            );
          }
        }

        const { password, ...newUser } = user;

        return done(null, {
          ...newUser,
        });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  "admin-local",
  new Strategy(
    { usernameField: "adminUsername", passwordField: "adminPassword" },
    async (loginUsername, loginPassword, done) => {
      try {
        const user = await User.findOne({
          where: { name: loginUsername },
          attributes: [
            "id",
            "name",
            "fullName",
            "birthday",
            "email",
            "contactNumber",
            "gender",
            "role",
            "password",
            "createdAt",
          ],
          raw: true,
        });

        if (!user) {
          return done(null, false, {
            message: "Incorrect username or password.",
          });
        }

        if (user.role === "client") {
          return done(null, false);
        }

        const isPasswordMatch = await comparePassword(
          loginPassword,
          user.password
        );

        if (!isPasswordMatch) {
          return done(null, false, {
            message: "Incorrect username or password.",
          });
        }

        const { password, ...newUser } = user;

        return done(null, {
          ...newUser,
        });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  process.nextTick(() => {
    done(null, user.id);
  });
});

passport.deserializeUser(async (userId, done) => {
  try {
    const user = await User.findByPk(userId, {
      attributes: [
        "id",
        "name",
        "fullName",
        "birthday",
        "email",
        "contactNumber",
        "gender",
        "role",
        "isFirstTimeLogin",
        "isProfileComplete",
        "avatar",
        "verified",
        "createdAt",
      ],
      raw: true,
    });

    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
});

export default passport;
