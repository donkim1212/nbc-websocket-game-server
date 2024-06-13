import { reinitialize, checkHighscore } from "../libs/game-state-manager.js";
import gsv from "../libs/game-state-verifier.js";

export const gameStart = async (uuid, payload) => {
  return await reinitialize(uuid, payload.timestamp);
};

export const gameEnd = async (userId, payload) => {
  const { score } = payload;

  // verification
  const currentStage = await gsv.userCurrentStageVerificationEx(userId);
  const deltaScore = gsv.scoreVerification(userId, currentStage, score);

  const ret = { status: "success", message: "Game ended", payload: { score } };

  // highscore 갱신
  if (await checkHighscore(userId, score)) ret.broadcast = { userId, highscore: score };

  return ret;
};
