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
    petWeight: { type: DataTypes.STRING },
    against: { type: DataTypes.STRING },
    manufacturer: { type: DataTypes.STRING },
    serialLotNumber: {
      type: DataTypes.STRING,
    },
    expiredDate: {
      type: DataTypes.STRING,
    },
    treatmentDateDone: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: true }
);

export default AppointmentPets;
