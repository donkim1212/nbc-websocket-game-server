import {
  getItemData,
  getItemUnlockStage,
  getItemUnlockStageId,
  getStageData,
} from "../init/assets.js";
import { SCORE_ERROR_TOLERANCE } from "../constants.js";
import { stageModelRedis as stageModel } from "../models/stage.model.js";
import { getUserItemScore } from "../models/item.model.js";
import InvalidStageError from "./errors/classes/invalid-stage.error.js";

const gameStateVerifier = {
  stageVerification: function (stageId) {
    // stageId missing
    // if (!stageId) throw new InvalidStageError();

    // if the stage doesn't exist
    const stageData = getStageData(stageId);
    if (!stageData) throw new InvalidStageError("Target stage not found.");

    return stageData;
  },

  stagesVerification: async function (userId) {
    const stages = await stageModel.getStage(userId);
    if (!stages) throw new InvalidStageError("No stages found for the user");
    return stages;
  },

  userCurrentStageVerification: async function (userId, stageId) {
    // any of the parameters missing
    if (!userId) throw new InvalidStageError();

    // if the stage doesn't exist
    this.stageVerification(stageId);

    // if user doesn't have stages set
    const currentStage = await stageModel.getCurrentStage(userId);
    if (!currentStage) throw new InvalidStageError("No stages found for the user");
    // if user should really be on that stage
    if (currentStage.id !== stageId) throw new InvalidStageError("Current stage mismatch.");

    return currentStage;
  },

  userCurrentStageVerificationEx: async function (userId, stages) {
    const currentStage = await stageModel.getCurrentStage(userId, stages);
    if (!currentStage) throw new InvalidStageError("No stages found for the user.");
    return currentStage;
  },

  scoreVerification: function (userId, currentStage, currentScore) {
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

    // returns delta score w/o itemScore
    return currentScore - itemScore;
  },

  itemVerification: function (itemId) {
    // if (!itemId) throw new Error("itemId not given.");
    const item = getItemData(itemId);
    if (!item) throw new Error("Item's data doesn't exist.");
    return item;
  },

  userItemUnlockVerification: async function (userId, item, stages) {
    const userStages = stages ? stages : await stageModel.getStage(userId);
    const itemUnlockStage = getItemUnlockStage(item.id);
    const index = userStages.findIndex((data) => data.id === itemUnlockStage.id);
    if (index === -1) throw new Error("Item not unlocked yet.");
    return itemUnlockStage;
  },

  itemIntervalVerificationSync: function (userItem, minInterval) {
    const elapsedTime = Date.now() - userItem.timestamp;
    if (elapsedTime < minInterval) {
      throw new Error("Invalid item acquisition detected.");
    }
  },
};

export default gameStateVerifier;
