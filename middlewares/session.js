import config from "../config/config.js";
import dotenv from "dotenv";
import session from "express-session";
import MySQLStore from "express-mysql-session";

dotenv.config();

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

const sessionStoreOptions = {
  host: dbConfig.host,
  database: dbConfig.database,
  user: dbConfig.username,
  password: dbConfig.password,
};

const sessionStore = new MySQLStore(session);

const MySQLSessionStore = new sessionStore(sessionStoreOptions);

MySQLSessionStore.onReady()
  .then(() => {
    console.log("MySQLStore ready!");
  })
  .catch((error) => {
    console.error("There was an error preparing the MySQLStore:", error);
  });

export default MySQLSessionStore;
