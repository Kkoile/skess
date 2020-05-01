const getRedisConfiguration = () => {
    return {
        port: process.env.REDIS_PORT || 6379,
        host: process.env.REDIS_HOST || 'localhost'
    }
}

const getWebSocketConfiguration = () => {
    return {
        port: process.env.WEB_SOCKET_PORT || 5001
    }
}

export default {
    getRedisConfiguration,
    getWebSocketConfiguration
};