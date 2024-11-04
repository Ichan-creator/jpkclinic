import comparePassword from "../utils/comparePassword.js";
import { Strategy } from "passport-local";
import passport from "passport";
import { User } from "../models/index.models.js";

passport.use(
  new Strategy(
    { usernameField: "adminUsername", passwordField: "adminPassword" },
    async (adminUsername, adminPassword, done) => {
      try {
        const user = await User.findOne({
          where: { name: adminUsername },
          attributes: [
            "id",
            "name",
            "fullName",
            "birthday",
            "email",
            "contactNumber",
            "gender",
            "occupation",
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

        const isPasswordMatch = await comparePassword(
          adminPassword,
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
    done(null, user);
  });
});

passport.deserializeUser((user, done) => {
  process.nextTick(() => {
    return done(null, user);
  });
});

export default passport;
