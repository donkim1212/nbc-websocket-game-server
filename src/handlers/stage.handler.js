import { getGameAssets, getScoresPerSecond, getStageData } from "../init/assets.js";
import { setStage, getStage } from "../models/stage.model.js";
import { getUserItemScores } from "./item-score.handler.js";
import { SCORE_ERROR_TOLERANCE } from "../constants.js";

export const moveStageHandler = (userId, payload) => {
  // 유저의 현재 스테이지 정보
  let currentStages = getStage(userId);
  if (!currentStages) return { status: "fail", message: "No stages found for the user" };

  currentStages.sort((a, b) => a.id - b.id);
  const currentStage = currentStages[currentStages.length - 1];

  if (currentStage.id !== payload.currentStage) {
    return { status: "fail", message: "Current stage mismatch." };
  }

  if (!("score" in payload)) {
    return { status: "fail", message: "Score is missing." };
  }

  // 점수 검증
  const serverTime = Date.now();
  const elapsedTime = (serverTime - currentStage.timestamp) / 1000;
  const itemScores = getUserItemScores(userId);
  const scoresPerSecond = getStageData(currentStage.id).scoresPerSecond;
  const estimatedDeltaScore = payload.score - currentStage.prevScore - itemScores;
  const expectedDeltaScore = scoresPerSecond * elapsedTime;
  // 점수 미달 혹은 지연시간 초과 체크, 5는 임의로 정한 숫자
  // if (elapsedTime < 10 || elapsedTime > 10.5) {
  //   return { status: "fail", message: "Invalid elapsed time." };
  // }
  if (
    estimatedDeltaScore < expectedDeltaScore ||
    expectedDeltaScore > estimatedDeltaScore + SCORE_ERROR_TOLERANCE * scoresPerSecond
  ) {
    return { status: "fail", message: "Invalid elapsed time." };
  }

  const { stages } = getGameAssets();
  const nextStage = getStageData(currentStage.id + 1);
  if (!stages.data.some((stage) => stage.id === nextStage.id)) {
    return { status: "fail", message: "Target stage not found." };
  }

  setStage(userId, nextStage.id, Date.now(), payload.score - itemScores);

  const temp = getStageData(nextStage.id + 1);
  const targetScore = temp === -1 ? Number.MAX_VALUE : temp.score;
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
