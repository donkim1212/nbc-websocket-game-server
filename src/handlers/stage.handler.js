import { getGameAssets } from "../init/assets.js";
import { setStage, getStage } from "../models/stage.model.js";

export const moveStageHandler = (userId, payload) => {
  // 유저의 현재 스테이지 정보
  let currentStages = getStage(userId);
  if (!currentStages) return { status: "fail", message: "No stages found for the user" };

  currentStages.sort((a, b) => a.id - b.id);
  const currentStage = currentStages[currentStages.length - 1];

  if (currentStage.id !== payload.currentStage) {
    return { status: "fail", message: "Current stage mismatch." };
  }

  // 점수 검증
  const serverTime = Date.now();
  const elapsedTime = (serverTime - currentStage.timestamp) / 1000;

  // 점수 미달 혹은 지연시간 초과 체크, 5는 임의로 정한 숫자
  if (elapsedTime < 100 || elapsedTime > 105) {
    return { status: "fail", message: "Invalid elapsed time." };
  }

  const { stages } = getGameAssets();
  if (!stages.data.some((stage) => stage.id === payload.targetStage)) {
    return { status: "fail", message: "Target stage not found." };
  }

  setStage(userId, payload.targetStage, Date.now());

  return { status: success };
};
