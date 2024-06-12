import { getUnlockedItemIdByStageId } from "../init/assets.js";
import { setStage } from "../models/stage.model.js";
import gsv from "../libs/game-state-verifier.js";

export const moveStageHandler = (userId, payload) => {
  // 유저의 현재 스테이지 정보 검증
  const currentStage = gsv.userCurrentStageVerification(userId, payload.currentStage);

  // 현재 점수 검증
  const deltaScore = gsv.scoreVerification(userId, currentStage, payload.score);

  // advance stage
  const nextStage = gsv.stageVerification(currentStage.id + 1);

  setStage(userId, nextStage.id, Date.now(), deltaScore);

  const unlockedId = getUnlockedItemIdByStageId(nextStage.id);

  return {
    status: "success",
    message: "Move to next stage.",
    payload: {
      id: nextStage.id,
      scoresPerSecond: nextStage.scoresPerSecond,
      targetScore: nextStage.score,
      unlockedItemId: unlockedId,
    },
  };
};
