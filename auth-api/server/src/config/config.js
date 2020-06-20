
require('dotenv').config();

module.exports = {

  // Using online database
  // development: {
  //   use_env_variable: 'DATABASE_URL'
  // },

  development: {
    database: 'auth_database',
    username: 'adrien',
    password: 'test',
    host: '127.0.0.1',
    port: '5000',
    dialect: 'postgres'
  },

  test: {
    database: 'auth_database_test',
    username: 'adrien',
    password: 'test',
    host: '127.0.0.1',
    port: '5000',
    dialect: 'postgres'
  },

  production: {
    database: process.env.POSTGRES_DB,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres'
  }
};