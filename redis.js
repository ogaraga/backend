const Redis = require('redis');


const redisClient = Redis.createClient();

redisClient.connect().then(()=>console.log('Redis connection Established!')).catch(()=>console.log('Redis connection Error'))

module.exports = redisClient;