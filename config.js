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
  },
  postgresTable: {
    createUrls: `CREATE TABLE IF NOT EXISTS urls
    (req_url TEXT NOT NULL,short_id CHAR (8) UNIQUE NOT NULL)`,
    createIps: `CREATE TABLE IF NOT EXISTS ips
    (req_ip TEXT NOT NULL,short_id CHAR (8) NOT NULL)`,
    dropUrls: `DROP TABLE IF EXISTS urls`,
    dropIps: `DROP TABLE IF EXISTS ips`,
  }
};
