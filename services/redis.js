const redis = require("redis");
const { promisify } = require("util");
const { host, port } = require('./../config').redis;

const client = redis.createClient({ host, port});

client.on('connect', () => {
  console.log(`Redis: Connected on port ${port}`);
});

client.on('error', (err) => {
  console.log(`Redis: ${err.message}`);
});

client.on('reconnecting', () => {
  console.log('Redis: reconnecting...');
});

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

module.exports = {
  client,
  getAsync,
  setAsync,
};
