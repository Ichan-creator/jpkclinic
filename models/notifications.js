import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Notifications = sequelize.define(
  "notifications",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    service: {
      type: DataTypes.STRING,
    },
    dateAndTime: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { timestamps: true }
);

export default Notifications;
