import { getGameAssets, getUnlockedItemIdByStageId } from "../init/assets.js";
import { initUserItem, removeUserItemData } from "../models/item.model.js";
import { stageModelRedis as stageModel } from "../models/stage.model.js";

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

const checkHighscore = (userId, score) => {
  // checks highscore list and add new score if necessary
  // return highscore
  return score; // temp
};

export { reinitialize, clearGameData, checkHighscore };
