const Redis = require("ioredis");
const redis = new Redis();


const getLastDataPacketTime = async () => {
  
  const reply=await redis.hget('lastDataPacketTime','INEM_DEMO');
  return reply;
};

const setLastDataPacketTime = async (time) =>{

  await redis.hset('lastDataPacketTime','INEM_DEMO',time)
}

const setConnectionTimeout = async (time) =>{
  await redis.hset('connection_timeout','INEM_DEMO',time);
}

module.exports={
  getLastDataPacketTime,
  setLastDataPacketTime,
  setConnectionTimeout
}
