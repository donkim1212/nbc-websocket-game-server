import { getGameAssets, getUnlockedItemIdByStageId } from "../init/assets.js";
import { initUserItem, removeUserItemData } from "../models/item.model.js";
import { clearStage, removeStage, setStage, getStage } from "../models/stage.model.js";

const reinitialize = (userId, timestamp) => {
  const { stages } = getGameAssets();
  clearStage(userId);
  setStage(userId, stages.data[0].id, timestamp, 0);

  initUserItem(userId);

  const unlockedItems = [];
  unlockedItems.push(getUnlockedItemIdByStageId(stages.data[0].id));

  console.log("Stage:", getStage(userId));
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

const clearGameData = (userId) => {
  removeUserItemData(userId);
  removeStage(userId);
};

export { reinitialize, clearGameData };
