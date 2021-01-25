require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  postgres: {
    user: process.env.PG_USER,
    host: process.env.PG_HOST || 'localhost',
    database: process.env.PG_DB,
    password: process.env.PG_PASS || null,
    port: process.env.PG_PORT || 5432,
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  }
};
