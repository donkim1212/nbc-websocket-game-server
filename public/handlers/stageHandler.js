import { score as gameScore, itemController } from "../index.js";

const stageHandler = (payload) => {
  gameScore.setNextStage(payload.id, payload.targetScore, payload.scoresPerSecond);
  itemController.unlockItem(payload.unlockedItemId);
  console.log("Unlocked: ", itemController.unlockedItems);
  console.log("Next: ", payload.targetScore);
};

export default stageHandler;
