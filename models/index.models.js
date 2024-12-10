import sequelize from "../config/database.js";
import Appointments from "./appointments.js";
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

Pets.hasMany(Appointments, { foreignKey: "petId" });
Appointments.belongsTo(Pets, { foreignKey: "petId" });

async function initDB() {
  await sequelize.sync({ force: true });
}

export { sequelize, initDB, Appointments, Notifications, Pets, User, Services };
