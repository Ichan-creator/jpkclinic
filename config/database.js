import config from "./config.js";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    port: 3306,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
  }
);

export default sequelize;
