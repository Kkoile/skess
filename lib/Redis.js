const ConfigService = require("./ConfigService");
const promisify = require('util').promisify;

const redis = require('redis');
const redisAdapter = require('socket.io-redis');
const configuration = ConfigService.getRedisConfiguration();

const client = redis.createClient(configuration);
const clientGetItem = promisify(client.get).bind(client);
const clientSetItem = promisify(client.set).bind(client);
const clientDeleteItem = promisify(client.del).bind(client);

const getRedisAdapter = () => {
    return redisAdapter(configuration);
}

const setItem = (key, value) => {
    return clientSetItem(key, JSON.stringify(value));
};

const getItem = async (key) => {
    const value = await clientGetItem(key);
    return JSON.parse(value);
}

const deleteItem = async (key) => {
    return await clientDeleteItem(key);
}

module.exports = {
    getItem,
    setItem,
    deleteItem,
    getRedisAdapter
}