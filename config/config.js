import dotenv from "dotenv";

dotenv.config();

const {
  HOST,
  TEST_DATABASE,
  TEST_DBUSER,
  PROD_DATABASE,
  PROD_DBUSER,
  DBPASSWORD,
} = process.env;

export default {
  development: {
    host: HOST,
    database: TEST_DATABASE,
    username: TEST_DBUSER,
    password: DBPASSWORD,
    dialect: "mysql",
  },
  production: {
    host: HOST,
    database: PROD_DATABASE,
    username: PROD_DBUSER,
    password: DBPASSWORD,
    dialect: "mysql",
  },
};
