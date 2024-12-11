import sequelize from "../config/database.js";
import Appointments from "./appointments.js";
import AppointmentPets from "./appointmentPets.js";
import Notifications from "./notifications.js";
import Pets from "./pets.js";
import User from "./user.js";
import Services from "./services.js";

User.hasMany(Appointments, { foreignKey: "userId" });
Appointments.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Pets, { foreignKey: "userId" });
Pets.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Notifications, { foreignKey: "userId" });
Notifications.belongsTo(User, { foreignKey: "userId" });

Appointments.belongsToMany(Pets, {
  through: AppointmentPets,
  foreignKey: "appointmentId",
});
Pets.belongsToMany(Appointments, {
  through: AppointmentPets,
  foreignKey: "petId",
});

async function initDB() {
  await sequelize.sync({ alter: true });
}

export {
  sequelize,
  initDB,
  Appointments,
  Notifications,
  Pets,
  User,
  Services,
  AppointmentPets,
};
