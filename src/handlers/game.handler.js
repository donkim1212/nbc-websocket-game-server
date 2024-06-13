import { reinitialize } from "../libs/game-state-manager.js";
import { stageModelRedis as stageModel } from "../models/stage.model.js";

export const gameStart = async (uuid, payload) => {
  return await reinitialize(uuid, payload.timestamp);
};

export const gameEnd = async (uuid, payload) => {
  const { timestamp: gameEndTime, score } = payload;
  const stages = await stageModel.getStage(uuid);
  if (!stages.length) {
    return { status: "fail", message: "No stages found for the user." };
  }

  let totalScore = 0;
  stages.forEach((stage, index) => {
    let stageEndTime;
    if (index === stages.length - 1) {
      stageEndTime = gameEndTime;
    } else {
      stageEndTime = stages[index + 1].timestamp;
    }

    const stageDuration = (stageEndTime - stage.timestamp) / 1000;
    totalScore += stageDuration; // 초당 1점
  });

  // 점수와 타임스탬프 검증
  if (Math.abs(score - totalScore) > 5) {
    return { status: "fail", message: "Score verification failed." };
  }

  // DB가 있다면 여기서 저장

  return { status: "success", message: "Game ended", payload: { score } };
};
