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
  createStage: async function (userId) {
    await redisClient.set("" + userId, "[]");
  },
  getStage: async function (userId) {
    return JSON.parse(await redisClient.get("" + userId));
  },
  getCurrentStage: async function (userId, paramStages) {
    const stages = paramStages ? paramStages : await this.getStage("" + userId);
    if (!stages) return null;
    return stages[stages.length - 1];
  },
  setStage: async function (userId, stageId, timestamp, prevScore) {
    const data = await this.getStage(userId);
    data.push({ id: stageId, timestamp, prevScore });
    await redisClient.set("" + userId, JSON.stringify(data));
    return data;
  },
  clearStage: async function (userId) {
    await redisClient.set("" + userId, "[]");
  },
  removeStage: function (userId) {
    // placeholder
    return;
  },
};
