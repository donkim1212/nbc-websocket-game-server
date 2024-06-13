import { createClient } from "redis";

const redisClient = await createClient({
  url: "redis://localhost:6379",
})
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

export default redisClient;

// await redisClient.set('key', 'value');
// const value = await redisClient.get('key');
// await redisClient.disconnect();
