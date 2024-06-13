import redisClient from "../init/redis.connect.js";

const stages = {};

export const stageModel = {
  createStage: (uuid) => {
    stages[uuid] = [];
  },
  getStage: (uuid) => {
    return stages[uuid];
  },
  getCurrentStage: (uuid) => {
    if (!this.getStage(uuid)) return null;
    return stages[uuid][stages[uuid].length - 1];
  },
  setStage: (uuid, id, timestamp, prevScore) => {
    return stages[uuid].push({ id, timestamp, prevScore });
  },
  clearStage: (uuid) => {
    return (stages[uuid] = []);
  },
  removeStage: (uuid) => {
    delete stages[uuid];
  },
};

export const stageModelRedis = {
  createStage: async (userId) => {
    await redisClient.set(userId, JSON.stringify([]));
  },
  getStage: async (userId) => {
    return JSON.stringify(await redisClient.get(userId));
  },
  getCurrentStage: async (userId) => {
    const stages = await this.getStageRedis(userId);
    if (!stages) return null;
    return stages[stages.length - 1];
  },
  setStage: async (userId, stageId, timestamp, prevScore) => {
    const data = await this.getStageRedis(userId);
    data.push({ id: stageId, timestamp, prevScore });
    await redisClient.set(userId, data);
    return data;
  },
  clearStage: async (userId) => {
    await redisClient.set(userId, JSON.stringify([]));
  },
  removeStage: (userId) => {
    // placeholder
    return;
  },
};
