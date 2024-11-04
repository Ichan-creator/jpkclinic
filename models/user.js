import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    fullName: { type: DataTypes.STRING },
    birthday: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    contactNumber: { type: DataTypes.STRING },
    gender: { type: DataTypes.STRING },
    isFirstTimeLogin: { type: DataTypes.BOOLEAN, defaultValue: true },
    isProfileComplete: { type: DataTypes.BOOLEAN, defaultValue: false },
    avatar: {
      type: DataTypes.STRING,
      defaultValue: "/images/profile-icon.png",
    },
    verified: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING },
  },
  { timestamps: true }
);

export default User;
