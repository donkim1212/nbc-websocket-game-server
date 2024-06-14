import { getUnlockedItemIdByStageId } from "../init/assets.js";
import { stageModelRedis as stageModel } from "../models/stage.model.js";
import gsv from "../libs/game-state-verifier.js";

export const moveStageHandler = async (userId, payload, timestamp) => {
  // 유저의 현재 스테이지 정보 검증
  const currentStage = await gsv.userCurrentStageVerificationEx(userId);

  // 현재 점수 검증
  const deltaScore = gsv.scoreVerification(userId, currentStage, payload.score, timestamp);

  // advance stage
  const nextStage = gsv.stageVerification(currentStage.id + 1);

  await stageModel.setStage(userId, nextStage.id, timestamp, deltaScore);

  const unlockedId = getUnlockedItemIdByStageId(nextStage.id);
  const item = getItemData(unlockedId);

  return {
    status: "success",
    message: "Move to next stage.",
    payload: {
      id: nextStage.id,
      scoresPerSecond: nextStage.scoresPerSecond,
      targetScore: nextStage.score,
      unlockedItem: item,
    },
  };
};
