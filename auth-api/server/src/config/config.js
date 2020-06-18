
require('dotenv').config();

module.exports = {

  // Using online database
  // development: {
  //   use_env_variable: 'DATABASE_URL'
  // },

  development: {
    database: 'auth_database',
    username: 'adrien',
    password: 'null',
    host: '127.0.0.1',
    dialect: 'postgres'
  },

  test: {
    database: 'auth_database_test',
    username: 'adrien',
    password: null,
    host: '127.0.0.1',
    dialect: 'postgres'
  },

  production: {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    dialect: 'postgres'
  }
};