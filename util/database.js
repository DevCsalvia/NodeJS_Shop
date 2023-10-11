const { Pool } = require("pg");
const toCamelCase = require("./to-camel-case");

const credentials = {
  user: "postgres",
  host: "localhost",
  database: "node-shop",
  password: "postgres",
  port: 5432,
};

module.exports = (callback = null) => {
  // NOTE: PostgreSQL creates a superuser by default on localhost using the OS username.
  const pool = new Pool(credentials);

  const connection = {
    pool,
    query: (...args) => {
      return pool.connect().then((client) => {
        return client.query(...args).then((res) => {
          client.release();
          return toCamelCase(res.rows);
        });
      });
    },
  };

  process.postgresql = connection;

  if (callback) {
    callback(connection);
  }

  return connection;
};
