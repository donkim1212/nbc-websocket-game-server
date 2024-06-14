import { getItemScore, getItemMinIntervalByItemId } from "../init/assets.js";
import { addUserItem, getUserItem } from "../models/item.model.js";
import gsv from "../libs/game-state-verifier.js";

// Verify item, returns its score
export const itemScoreHandler = async (userId, payload) => {
  const { itemId } = payload;
  const item = await gsv.itemVerification(itemId);
  const stages = await gsv.stagesVerification(userId);
  const currentStage = await gsv.userCurrentStageVerificationEx(userId, stages);
  const unlockStage = await gsv.userItemUnlockVerification(userId, item, stages);

  const minInterval = getItemMinIntervalByItemId(itemId);
  const userItem = getUserItem(userId);
  gsv.itemIntervalVerificationSync(userItem, minInterval);

  const itemScore = getItemScore(itemId);

  addUserItem(userId, itemScore);

  return { status: "success", message: "Item obtained.", payload: { score: itemScore } };
};
