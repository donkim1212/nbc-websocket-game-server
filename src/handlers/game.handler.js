import { reinitialize, checkHighscore } from "../libs/game-state-manager.js";
import gsv from "../libs/game-state-verifier.js";

export const gameStart = async (uuid, payload, timestamp) => {
  return await reinitialize(uuid, timestamp);
};

export const gameEnd = async (userId, payload, timestamp) => {
  const { score } = payload;

  const stages = await gsv.stagesVerification(userId);
  // verification
  const currentStage = await gsv.userCurrentStageVerificationEx(userId, stages);
  const deltaScore = gsv.scoreVerification(userId, currentStage, score);

  const ret = { status: "success", message: "Game ended", payload: { score } };

  // highscore 갱신
  if (await checkHighscore(userId, score)) ret.broadcast = { userId, highscore: score };

  return ret;
};
