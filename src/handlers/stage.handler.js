import { getUnlockedItemIdByStageId } from "../init/assets.js";
import { stageModelRedis as stageModel } from "../models/stage.model.js";
import gsv from "../libs/game-state-verifier.js";
import redisClient from "../init/redis.connect.js";

export const moveStageHandler = async (userId, payload) => {
  // 유저의 현재 스테이지 정보 검증
  const currentStage = await gsv.userCurrentStageVerification(userId, payload.currentStage);

  // 현재 점수 검증
  const deltaScore = gsv.scoreVerification(userId, currentStage, payload.score);

  // advance stage
  const nextStage = gsv.stageVerification(currentStage.id + 1);

  await stageModel.setStage(userId, nextStage.id, Date.now(), deltaScore);

  const unlockedId = getUnlockedItemIdByStageId(nextStage.id);

  // await redisClient.set("key", "value");
  // const value = await redisClient.get("key");
  // console.log(value);
  // await redisClient.disconnect();

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
