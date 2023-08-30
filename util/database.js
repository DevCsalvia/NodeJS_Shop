const Sequelize = require("sequelize");

const credentials = {
  user: "postgres",
  host: "localhost",
  database: "node-shop",
  password: "postgres",
  port: 5432,
};

module.exports = new Sequelize(
  credentials.database,
  credentials.user,
  credentials.password,
  { dialect: "postgresql", host: credentials.host },
);
