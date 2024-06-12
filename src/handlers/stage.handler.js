import { getGameAssets, getStageData } from "../init/assets.js";
import { setStage, getStage } from "../models/stage.model.js";
import gsv from "../libs/verifiers/game-state.verifier.js";

export const moveStageHandler = (userId, payload) => {
  // 유저의 현재 스테이지 정보 검증
  const currentStage = gsv.currentStageVerification(userId, payload.currentStage);

  // 현재 점수 검증
  const deltaScore = gsv.scoreVerification(userId, currentStage, payload.score);

  // advance stage
  const { stages } = getGameAssets();
  const nextStage = gsv.stageVerification(currentStage.id + 1);
  if (!stages.data.some((stage) => stage.id === nextStage.id)) {
    return { status: "fail", message: "Target stage not found." };
  }

  setStage(userId, nextStage.id, Date.now(), deltaScore);

  const temp = getStageData(nextStage.id + 1);
  const targetScore = !temp ? Number.MAX_VALUE : temp.score;

  return {
    status: "success",
    message: "Move to next stage.",
    payload: {
      id: nextStage.id,
      scoresPerSecond: nextStage.scoresPerSecond,
      targetScore: targetScore,
    },
  };
};
