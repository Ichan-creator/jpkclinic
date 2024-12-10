import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Services = sequelize.define(
  "services",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    serviceName: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: true }
);

export default Services;
