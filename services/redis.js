const redis = require("redis");
const { promisify } = require("util");
const redisConfig = require('./../config').redis;

const connPool = {};

const connect = (config) => {
  const { host, port } = config;
  
	if (!connPool[port]) {
    const client = redis.createClient({ host, port})
    connPool[port] = client;
    
    client.on('connect', () => {
      console.log(`Redis: Connected on port ${port}`);
    });
    
    client.on('error', (err) => {
      console.log(`Redis: ${err.message}`);
    });
    
    client.on('reconnecting', () => {
      console.log('Redis: reconnecting...');
    });
	}
	return connPool[port];
};

const client = connect(redisConfig);
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

module.exports = {
  connect: (config) => connect(config),
  getAsync,
  setAsync,
};
