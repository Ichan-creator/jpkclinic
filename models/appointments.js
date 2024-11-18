import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Appointments = sequelize.define(
  "appointments",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    petNames: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
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
    petWeight: { type: DataTypes.STRING },
    temperature: { type: DataTypes.STRING },
    ppm: { type: DataTypes.STRING },
    cbc: { type: DataTypes.STRING },
    urinalysisResult: { type: DataTypes.STRING },
    respiratoryRate: { type: DataTypes.STRING },
    observation: { type: DataTypes.STRING },
    prescription: { type: DataTypes.STRING },
  },
  { timestamps: true }
);

export default Appointments;
