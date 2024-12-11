import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Pets from "./pets.js";

const Appointments = sequelize.define(
  "appointments",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    concern: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    service: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    appointmentDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    veterinarian: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateApproved: {
      type: DataTypes.STRING,
    },
    appointmentStatus: {
      type: DataTypes.STRING,
    },
    medicalRecordStatus: {
      type: DataTypes.STRING,
    },
    treatmentDateDone: {
      type: DataTypes.STRING,
    },
    serialLotNumber: {
      type: DataTypes.STRING,
    },
    expiredDate: {
      type: DataTypes.STRING,
    },
    petWeight: { type: DataTypes.STRING },
    against: { type: DataTypes.STRING },
    manufacturer: { type: DataTypes.STRING },
  },
  { timestamps: true }
);

export default Appointments;
