import {
  getItemData,
  getItemUnlockStage,
  getItemUnlockStageId,
  getStageData,
} from "../init/assets.js";
import { SCORE_ERROR_TOLERANCE } from "../constants.js";
import { getCurrentStage, getStage } from "../models/stage.model.js";
import { getUserItemScore } from "../models/item.model.js";
import InvalidStageError from "./errors/classes/invalid-stage.error.js";

const gameStateVerifier = {
  stageVerification: function (stageId) {
    // stageId missing
    if (!stageId) throw new InvalidStageError();

    // if the stage doesn't exist
    const stageData = getStageData(stageId);
    if (!stageData) throw new InvalidStageError("Target stage not found.");

    return stageData;
  },

  userCurrentStageVerification: function (userId, stageId) {
    // any of the parameters missing
    if (!userId) throw new InvalidStageError();

    // if the stage doesn't exist
    this.stageVerification(stageId);

    // if user doesn't have stages set
    const currentStage = getCurrentStage(userId);
    if (!currentStage) throw new InvalidStageError("No stages found for the user");
    // if user should really be on that stage
    if (currentStage.id !== stageId) throw new InvalidStageError("Current stage mismatch.");

    return currentStage;
  },

  scoreVerification: function (userId, currentStage, currentScore) {
    // any of the parameters missing
    if ((!userId, !currentStage, !currentScore)) {
      throw new Error("Score verification failed.");
    }

    // check if user played valid amount of time
    const serverTime = Date.now();
    const elapsedTime = (serverTime - currentStage.timestamp) / 1000;
    const itemScore = getUserItemScore(userId);
    const scoresPerSecond = getStageData(currentStage.id).scoresPerSecond;
    const estimatedDeltaScore = currentScore - currentStage.prevScore - itemScore;
    const expectedDeltaScore = scoresPerSecond * elapsedTime;

    if (
      estimatedDeltaScore < expectedDeltaScore ||
      estimatedDeltaScore > expectedDeltaScore + SCORE_ERROR_TOLERANCE * scoresPerSecond
    ) {
      throw new Error("Invalid elapsed time.");
    }

    return currentScore - itemScore;
  },

  itemVerifier: function (itemId) {
    if (!itemId) throw new Error("itemId not given.");
    const item = getItemData(itemId);
    if (!item) throw new Error("Item's data doesn't exist.");
    return item;
  },

  userItemUnlockVerification: function (userId, itemId) {
    const userStages = getStage(userId);
    const itemUnlockStage = getItemUnlockStage(itemId);
    const index = userStages.findIndex((data) => data.id === itemUnlockStage.stage_id);
    if (index === -1) throw new Error("Item not unlocked yet.");
    return itemUnlockStage;
  },

  userObtainedItemVerification: function (userId, itemId) {
    const item = this.itemVerifier(itemId);

    // find item's unlock stage using getItemUnlockStage(itemId)
    const unlocksAt = getItemUnlockStageId(item.id);
    // use getStage(userId) to get user's stages
    const stages = getStage(userId);
    // check if the user's stages contain unlock stage
    const index = stages.findIndex((stage) => stage.id === unlocksAt);
    if (index === -1) throw new Error("Invalid item acquisition detected.");

    return item;
  },
};

export default gameStateVerifier;
