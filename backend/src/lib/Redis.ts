import ConfigService from "./ConfigService";
import {promisify} from "util";
import * as redis from 'redis';

import redisAdapter = require('socket.io-redis');
const configuration = ConfigService.getRedisConfiguration();

const client = redis.createClient(configuration);
const clientGetItem = promisify(client.get).bind(client);
const clientSetItem = promisify(client.set).bind(client);
const clientDeleteItem = promisify(client.del).bind(client);

const getClient = () => {
    return client;
}

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

export default {
    getItem,
    setItem,
    deleteItem,
    getRedisAdapter,
    getClient
};