import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Pets = sequelize.define(
  "pets",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    birthday: { type: DataTypes.TEXT },
    animalType: { type: DataTypes.TEXT },
    breed: { type: DataTypes.TEXT },
    gender: { type: DataTypes.TEXT },
    status: { type: DataTypes.TEXT },
  },
  { timestamps: true }
);

export default Pets;
