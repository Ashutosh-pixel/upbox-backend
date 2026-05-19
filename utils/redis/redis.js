const { createClient } = require("redis");

const redisClient = createClient({
    url: process.env.REDIS_URL
})

redisClient.on("error", (error) => {
    console.log("Redis ERROR", error);
})

module.exports = redisClient;
