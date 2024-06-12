import { getGameAssets, getStageData } from "../../init/assets.js";
import { getCurrentStage, getStage } from "../../models/stage.model.js";
import InvalidStageError from "../errors/classes/invalid-stage.error.js";
import { getUserItemScores } from "../../handlers/item-score.handler.js";
import { SCORE_ERROR_TOLERANCE } from "../../constants.js";

const gameStateVerifier = {
  stageVerification: function (stageId) {
    // stageId missing
    if (!stageId) throw new InvalidStageError();

    // if the stage doesn't exist
    const stageData = getStageData(stageId);
    if (!stageData) throw new InvalidStageError();

    return stageData;
  },

  currentStageVerification: function (userId, stageId) {
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

    const serverTime = Date.now();
    const elapsedTime = (serverTime - currentStage.timestamp) / 1000;
    const itemScore = getUserItemScores(userId);
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
};

export default gameStateVerifier;
