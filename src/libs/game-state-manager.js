import { getGameAssets, getItemData, getUnlockedItemIdByStageId } from "../init/assets.js";
import redisClient from "../init/redis.connect.js";
import { initUserItem, removeUserItemData } from "../models/item.model.js";
import { stageModelRedis as stageModel } from "../models/stage.model.js";

const HIGHSCORE_KEY = "highscore";
const HIGHSCORE_USER_KEY = "highscore_user";

const reinitialize = async (userId, timestamp) => {
  const { stages } = getGameAssets();
  await stageModel.clearStage(userId);
  await stageModel.setStage(userId, stages.data[0].id, timestamp, 0);

  initUserItem(userId);

  const unlockedItems = [];
  const unlockedItemId = getUnlockedItemIdByStageId(stages.data[0].id);
  const item = getItemData(unlockedItemId);
  unlockedItems.push(item);

  return {
    status: "success",
    payload: {
      id: stages.data[0].id,
      targetScore: stages.data[0].score,
      scoresPerSecond: stages.data[0].scoresPerSecond,
      unlockedItems: unlockedItems,
    },
  };
};

const clearGameData = async (userId) => {
  removeUserItemData(userId);
  stageModel.removeStage(userId);
};

const checkHighscore = async (userId, score) => {
  const highscore = await redisClient.hVals(HIGHSCORE_KEY);
  if (highscore.length === 0 || score >= +highscore[0]) {
    await redisClient.hSet(HIGHSCORE_KEY, "score", "" + score);
    await redisClient.hSet(HIGHSCORE_USER_KEY, "user_id", "" + userId);
    console.log("=======new highscore===", score);
    return true;
  }
  return false;
};

const getHighscore = async () => {
  const highscore = await redisClient.hVals(HIGHSCORE_KEY);
  const userId = await redisClient.hVals(HIGHSCORE_USER_KEY);
  return {
    userId: userId[0],
    highscore: highscore[0],
  };
};

export { reinitialize, clearGameData, checkHighscore, getHighscore };
