import { getGameAssets, getUnlockedItemIdByStageId } from "../init/assets.js";
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
  unlockedItems.push(getUnlockedItemIdByStageId(stages.data[0].id));

  console.log("Stage:", await stageModel.getStage(userId));
  console.log("", stages.data[0].scoresPerSecond);

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
  // checks highscore list and add new score if necessary
  const highscore = await redisClient.hVals(HIGHSCORE_KEY);
  // const highscoreUserId = await redisClient.hKeys(HIGHSCORE_KEY);
  // console.log("==========", highscore);
  if (highscore.length === 0 || score >= +highscore[0]) {
    await redisClient.hSet(HIGHSCORE_KEY, "score", "" + score);
    await redisClient.hSet(HIGHSCORE_USER_KEY, "user_id", "" + userId);
    console.log("=======new highscore===", score);
    return true;
  }
  return false; // temp
};

const getHighscore = async () => {
  // await redisClient.hGetAll(HIGHSCORE_KEY);
  const highscore = await redisClient.hVals(HIGHSCORE_KEY);
  const userId = await redisClient.hVals(HIGHSCORE_USER_KEY);
  console.log(userId, highscore);
  return {
    userId: userId[0],
    highscore: highscore[0],
  };
};

export { reinitialize, clearGameData, checkHighscore, getHighscore };
