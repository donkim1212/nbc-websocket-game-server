import { reinitialize } from "../libs/game-state-manager.js";
import gsv from "../libs/game-state-verifier.js";

export const gameStart = async (uuid, payload) => {
  return await reinitialize(uuid, payload.timestamp);
};

export const gameEnd = async (userId, payload) => {
  const { score } = payload;

  // const stages = getStage(userId);
  // if (!stages.length) {
  //   return { status: "fail", message: "No stages found for the user." };
  // }
  const currentStage = await gsv.userCurrentStageVerificationEx(userId);

  // let totalScore = 0;
  // stages.forEach((stage, index) => {
  //   let stageEndTime;
  //   if (index === stages.length - 1) {
  //     stageEndTime = gameEndTime;
  //   } else {
  //     stageEndTime = stages[index + 1].timestamp;
  //   }

  //   const stageDuration = (stageEndTime - stage.timestamp) / 1000;
  //   totalScore += stageDuration; // 초당 1점
  // });

  // 점수와 타임스탬프 검증
  const deltaScore = gsv.scoreVerification(userId, currentStage, score);
  // if (Math.abs(score - totalScore) > 5) {
  //   return { status: "fail", message: "Score verification failed." };
  // }

  // DB가 있다면 여기서 저장

  return { status: "success", message: "Game ended", payload: { score } };
};
