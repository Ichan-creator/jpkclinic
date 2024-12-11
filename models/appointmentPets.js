import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const AppointmentPets = sequelize.define(
  "appointment_pets",
  {
    appointmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "appointments",
        key: "id",
      },
    },
    petId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "pets",
        key: "id",
      },
    },
  },
  { timestamps: true }
);

export default AppointmentPets;
